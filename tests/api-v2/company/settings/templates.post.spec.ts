//POST: /api/v2/company/setting/templates

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/company/setting/templates POST requests @company", async () => {
    test("POST with valid credentials @happy", async ({ request }) => {
        const response = await request.post('/api/v2/company/setting/templates', {
            data: { "template": "default" },
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data[0].id).toBe(1);
        expect(body.data[0].name).toBe("Default");
        expect(body.data[0].selected).toBe(true);
        expect(body.data[1].id).toBe(2);
        expect(body.data[1].name).toBe("Classic");
        expect(body.data[1].selected).toBe(false);
        expect(body.data[2].id).toBe(3);
        expect(body.data[2].name).toBe("Elegant");
        expect(body.data[2].selected).toBe(false);
        expect(body.message).toBe("Template updated.");
    });

    test("POST with invalid credentials", async ({ request }) => {
        const response = await request.post('/api/v2/company/setting/templates', {
            data: { "template": "default" },
            headers: {
                "Accept": "application/json",
            }
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe("Unauthenticated.");
    });

    test("POST with valid credentials but another company ID", async ({ request }) => {
        // Company two should not be able to modify data from company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.post('/api/v2/company/setting/templates', {
            data: { "template": "default" },
            headers: maliciousHeaders
        });

        expect.soft(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("POST with candidate auth", async ({ request }) => {
        const response = await request.post('/api/v2/company/setting/templates', {
            data: { "template": "default" },
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