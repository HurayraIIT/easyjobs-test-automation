// GET: /api/v2/calendly/info

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/calendly/info GET requests @company @happy", async () => {
    test("GET with valid credentials and integration on @happy", async ({ request }) => {
        // Company one should have valid calendly information
        const response = await request.get(`/api/v2/calendly/info`, {
            headers: authObjects.companyOneAuthHeaders
        });
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.status).toBe("SUCCESS");
        expect(body.data.avatar_url).toBeNull();
        expect(body.data.created_at).toBe("2025-02-03T07:48:24.828761Z");
        expect(body.data.current_organization).toBe("https://api.calendly.com/organizations/9ddfca53-8d21-408e-bd47-c0baaf3d3437");
        expect(body.data.email).toBe("hurayra@wpdeveloper.com");
        expect(body.data.locale).toBe("en");
        expect(body.data.name).toBe("Abu Hurayra");
        expect(body.data.resource_type).toBe("User");
        expect(body.data.scheduling_url).toBe("https://calendly.com/hurayra-wpdeveloper");
        expect(body.data.slug).toBe("hurayra-wpdeveloper");
        expect(body.data.timezone).toBe("Asia/Dhaka");
        expect(body.data.updated_at).toContain("2025-02-03");
        expect(body.data.uri).toBe("https://api.calendly.com/users/d831ff1b-b622-45e7-9dce-588198b3cee7");
        expect(body.message).toBeNull();
    });

    // FLAKY TEST
    // test("GET with valid credentials and integration off @happy", async ({ request }) => {
    //     // Company two should have empty calendly information
    //     const response = await request.get(`/api/v2/calendly/info`, {
    //         headers: authObjects.companyTwoAuthHeaders
    //     });
    //     expect.soft(response.status()).toBe(400);

    //     const body = await response.json();

    //     expect.soft(body.status).toBe("FAILED");
    //     expect.soft(body.data).toEqual([]);
    //     expect.soft(body.message).toBe("Calendly Refresh Token Missing!");
    // });

    test("GET with invalid credentials @security", async ({ request }) => {
        // Company two should not be able to access data from company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.get(`/api/v2/calendly/info`, {
            headers: authObjects.companyTwoAuthHeaders
        });
        expect(response.status()).toBe(471);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("GET without auth token @security", async ({ request }) => {
        const response = await request.get(`/api/v2/calendly/info`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });
});