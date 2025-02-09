//GET: /api/v2/company/setting/custom-domain/admin

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createCompanySettingsKey, deleteAllCompanySettingsKeys } from '@datafactory/company-settings-key';

test.describe("/api/v2/company/setting/custom-domain/admin GET requests @company", async () => {
    test("GET with valid credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/custom-domain/admin`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.cname).toBe("");
        expect(body.message).toBeNull();
    });

    test("GET with invalid credentials", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/custom-domain/admin`, {
            headers: {
                "Accept": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe("Unauthenticated.");
    });

    test("GET with valid credentials but another company ID @security", async ({ request }) => {
        // Company two should not be able to access data from company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.get(`/api/v2/company/setting/custom-domain/admin`, {
            headers: maliciousHeaders
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("GET with candidate auth", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/custom-domain/admin`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });
});