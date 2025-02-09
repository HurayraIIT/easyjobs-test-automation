//POST: /api/v2/company/setting/user-app/update

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

const data = { "app_type": "zoom", "config": { "client_id": "xxx123", "client_secret": "asd123" } };

test.describe("/api/v2/company/setting/user-app/update POST requests @company", async () => {
    test("POST with valid credentials @happy", async ({ request }) => {
        const response = await request.post(`/api/v2/company/setting/user-app/update`, {
            headers: authObjects.companyOneAuthHeaders,
            data: data
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Updated.");
    });

    test("POST with invalid credentials", async ({ request }) => {
        const response = await request.post(`/api/v2/company/setting/user-app/update`, {
            headers: {
                "Accept": "application/json"
            },
            data: data
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe("Unauthenticated.");
    });

    test("POST with valid credentials but another company ID", async ({ request }) => {
        // Company two should not be able to modify data from company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.post(`/api/v2/company/setting/user-app/update`, {
            headers: maliciousHeaders,
            data: data
        });

        expect(response.status()).toBe(471);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    // TODO: Report issue
    // test("POST with candidate auth", async ({ request }) => {
    //     const response = await request.post(`/api/v2/company/setting/user-app/update`, {
    //         headers: authObjects.candidateOneAuthHeaders,
    //         data: data
    //     });

    //     expect(response.status()).toBe(480);

    //     const body = await response.json();

    //     // await createAssertions(body);
    //     expect(body.status).toBe("failed");
    //     expect(body.data).toEqual([]);
    //     expect(body.message).toBe("You do not have access permissions.");
    // });
});