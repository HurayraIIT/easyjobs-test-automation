//PUT: /api/v2/company/setting/remove-powered-by

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/company/setting/remove-powered-by PUT requests @company", async () => {
    test("PUT with valid credentials @happy", async ({ request }) => {
        const response = await request.put(`/api/v2/company/setting/remove-powered-by`, {
            headers: authObjects.companyOneAuthHeaders,
            data: { "remove_powered_by": true }
        });

        expect.soft(response.status()).toBe(200);
        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.message).toBe("Setting updated.");
    });

    test("PUT with invalid credentials", async ({ request }) => {
        const response = await request.put(`/api/v2/company/setting/remove-powered-by`, {
            headers: {
                "Accept": "application/json",
            },
            data: { "remove_powered_by": true }
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.message).toBe("Unauthenticated.");
    });

    test("PUT with valid credentials but another company ID", async ({ request }) => {
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        // maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.put(`/api/v2/company/setting/remove-powered-by`, {
            headers: maliciousHeaders,
            data: { "remove_powered_by": true }
        });

        expect.soft(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("PUT with candidate auth", async ({ request }) => {
        const response = await request.put(`/api/v2/company/setting/remove-powered-by`, {
            headers: authObjects.candidateOneAuthHeaders,
            data: { "remove_powered_by": true }
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });
});