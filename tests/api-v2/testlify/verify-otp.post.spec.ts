//POST: /api/v2/testlify/verify/otp

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/testlify/verify/otp POST requests @my-account", async () => {
    test("POST with valid credentials @happy", async ({ request }) => {
        const response = await request.post(`/api/v2/testlify/verify/otp`, {
            headers: authObjects.companyOneAuthHeaders,
            data: {
                "otp": "123456",
                "workspace_url": "https://hurayraiit.com"
            }
        });

        expect.soft(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Request Expired");
    });

    test("POST with another company ID", async ({ request }) => {
        // Company two should not be able to perform action for company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.post(`/api/v2/testlify/verify/otp`, {
            headers: maliciousHeaders,
            data: {
                "otp": "123456",
                "workspace_url": "https://hurayraiit.com"
            }
        });

        expect.soft(response.status()).toBe(471);

        const data = await response.json();
        // await createAssertions(data);
        expect(data.status).toBe("FAILED");
        expect(data.data).toEqual([]);
        expect(data.message).toBe("Something went wrong.");
    });

    test("POST without auth", async ({ request }) => {
        const response = await request.post(`/api/v2/testlify/verify/otp`, {
            headers: {
                "Accept": "application/json",
            },
            data: {
                "otp": "123456",
                "workspace_url": "https://hurayraiit.com"
            }
        });

        expect.soft(response.status()).toBe(401);

        const data = await response.json();
        // await createAssertions(data);
        expect(data.message).toBe("Unauthenticated.");
    });

    // TODO: Fix 500 server error
    test.skip("POST with candidate auth", async ({ request }) => {
        const response = await request.post(`/api/v2/testlify/verify/otp`, {
            headers: authObjects.candidateOneAuthHeaders,
            data: {
                "otp": "123456",
                "workspace_url": "https://hurayraiit.com"
            }
        });

        expect.soft(response.status()).toBe(500);

        const body = await response.json();
        // await createAssertions(body);
    });
});