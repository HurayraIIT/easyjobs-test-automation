//POST: /api/v2/testlify/send/otp

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/testlify/send/otp POST requests @my-account", async () => {
    test("POST with valid credentials @happy", async ({ request }) => {
        const response = await request.post(`/api/v2/testlify/send/otp`, {
            headers: authObjects.companyOneAuthHeaders,
            data: {}
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.cookies).toEqual({});
        expect(body.data.transferStats).toEqual({});
        expect(body.message).toBe("OTP send successfully.");
    });

    test("POST with another company ID @security", async ({ request }) => {
        // Company two should not be able to perform action for company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.post(`/api/v2/testlify/send/otp`, {
            headers: maliciousHeaders,
            data: {}
        });

        expect.soft(response.status()).toBe(471);

        const data = await response.json();
        // await createAssertions(data);
        expect(data.status).toBe("FAILED");
        expect(data.data).toEqual([]);
        expect(data.message).toBe("Something went wrong.");
    });

    test("POST without auth", async ({ request }) => {
        const response = await request.post(`/api/v2/testlify/send/otp`, {
            headers: {
                "Accept": "application/json",
            },
            data: {}
        });

        expect.soft(response.status()).toBe(401);

        const data = await response.json();
        // await createAssertions(data);
        expect(data.message).toBe("Unauthenticated.");
    });

    // TODO: Fix 500 server error
    test.skip("POST with candidate auth", async ({ request }) => {
        const response = await request.post(`/api/v2/testlify/send/otp`, {
            headers: authObjects.candidateOneAuthHeaders,
            data: {}
        });

        expect.soft(response.status()).toBe(500);

        const body = await response.json();
        // await createAssertions(body);
    });
});