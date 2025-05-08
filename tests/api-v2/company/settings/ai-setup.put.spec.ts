//PUT: /api/v2/company/setting/ai-setup

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

const data = { "is_ai_enabled": true };

test.describe("/api/v2/company/setting/ai-setup PUT requests @company", async () => {
    test("PUT with valid credentials @happy", async ({ request }) => {
        // PUT the basic description
        const response = await request.put(`/api/v2/company/setting/ai-setup`, {
            headers: authObjects.companyOneAuthHeaders,
            data: data
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.message).toBe("Updated.");
    });

    test("PUT with invalid credentials", async ({ request }) => {
        const response = await request.put(`/api/v2/company/setting/ai-setup`, {
            headers: {
                "Accept": "application/json"
            },
            data: data
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe("Unauthenticated.");
    });

    test("PUT with valid credentials but another company ID", async ({ request }) => {
        // Company two should not be able to modify data from company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.put(`/api/v2/company/setting/ai-setup`, {
            headers: maliciousHeaders,
            data: data
        });

        expect.soft(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("PUT with candidate auth", async ({ request }) => {
        const response = await request.put(`/api/v2/company/setting/ai-setup`, {
            headers: authObjects.candidateOneAuthHeaders,
            data: data
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });
});