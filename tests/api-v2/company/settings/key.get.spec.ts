//GET: /api/v2/company/setting/key

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createCompanySettingsKey, deleteAllCompanySettingsKeys } from '@datafactory/company-settings-key';

test.describe("/api/v2/company/setting/key GET requests @company", async () => {
    // test.beforeAll(async () => {
    //     await deleteAllCompanySettingsKeys(authObjects.companyOneAuthHeaders);
    // });

    test("GET with valid credentials @happy", async ({ request }) => {
        // Get the integrations
        const response = await request.get(`/api/v2/company/setting/key?type=1`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        // expect(body.data[0].id).toBe(655);
        // expect(body.data[0].label).toBe("Test App Key Label");
        // expect(body.data[0].key).toBe("695c61fa-8931-4bb6-892d-1d634a5aff5c");
        // expect(body.data[0].type).toBe(1);
        // expect(body.data[0].used).toBe(0);
        expect(body.message).toBeNull();
    });

    test("GET with invalid credentials", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/key?type=1`, {
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

        const response = await request.get(`/api/v2/company/setting/key?type=1`, {
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
        const response = await request.get(`/api/v2/company/setting/key?type=1`, {
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