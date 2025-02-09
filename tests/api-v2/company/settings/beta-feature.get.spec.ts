//GET: /api/v2/company/setting/beta-feature

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/company/setting/beta-feature GET requests @company", async () => {
    test("GET with valid credentials @happy", async ({ request }) => {
        // Get the beta features
        const response = await request.get(`/api/v2/company/setting/beta-feature`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.enabled_candidate_tiny_icon).toBe(true);
        expect(body.data.enabled_candidate_card_opacity).toBe(true);
        expect(body.message).toBeNull();
    });

    test("GET with invalid credentials", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/beta-feature`, {
            headers: {
                "Accept": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe("Unauthenticated.");
    });

    test("GET with valid credentials but another company ID", async ({ request }) => {
        // Company two should not be able to access data from company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.get(`/api/v2/company/setting/beta-feature`, {
            headers: maliciousHeaders
        });

        expect(response.status()).toBe(471);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    // TODO: Report Issue
    // test("GET with candidate auth", async ({ request }) => {
    //     const response = await request.get(`/api/v2/company/setting/beta-feature`, {
    //         headers: authObjects.candidateOneAuthHeaders
    //     });

    //     expect.soft(response.status()).toBe(480);

    //     const body = await response.json();

    //     // await createAssertions(body);
    //     expect(body.status).toBe("failed");
    //     expect(body.data).toEqual([]);
    //     expect(body.message).toBe("You do not have access permissions.");
    // });
});