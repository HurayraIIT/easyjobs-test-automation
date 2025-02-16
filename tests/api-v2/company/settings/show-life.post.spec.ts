//POST: /api/v2/company/setting/show-life

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/company/setting/show-life POST requests @company", async () => {
    // This can only be performed after uploading "life at" photos
    // test("POST with valid credentials @happy", async ({ request }) => {
    //     const response = await request.post(`/api/v2/company/setting/show-life`, {
    //         headers: authObjects.companyOneAuthHeaders,
    //         data: { "show_life": true }
    //     });

    //     expect(response.status()).toBe(200);
    //     const body = await response.json();
    //     await createAssertions(body);
    // });

    test("POST with invalid credentials", async ({ request }) => {
        const response = await request.post(`/api/v2/company/setting/show-life`, {
            headers: {
                "Accept": "application/json",
            },
            data: { "show_life": true }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.message).toBe("Unauthenticated.");
    });

    test("POST with valid credentials but another company ID", async ({ request }) => {
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        // maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.post(`/api/v2/company/setting/show-life`, {
            headers: maliciousHeaders,
            data: { "show_life": true }
        });

        expect.soft(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("POST with candidate auth", async ({ request }) => {
        const response = await request.post(`/api/v2/company/setting/show-life`, {
            headers: authObjects.candidateOneAuthHeaders,
            data: { "show_life": true }
        });

        expect(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });
});