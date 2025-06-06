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
        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        expect.soft(body.status).toBe("SUCCESS");
        expect.soft(body.data.avatar_url).toBeNull();
        expect.soft(body.data.created_at).toContain("2025");
        expect.soft(body.data.current_organization).toBe("https://api.calendly.com/organizations/9ddfca53-8d21-408e-bd47-c0baaf3d3437");
        expect.soft(body.data.email).toBe("hurayra@wpdeveloper.com");
        expect.soft(body.data.locale).toBe("en");
        expect.soft(body.data.name).toBe("Abu Hurayra");
        expect.soft(body.data.resource_type).toBe("User");
        expect.soft(body.data.scheduling_url).toBe("https://calendly.com/hurayra-wpdeveloper");
        expect.soft(body.data.slug).toBe("hurayra-wpdeveloper");
        expect.soft(body.data.timezone).toBe("Asia/Dhaka");
        expect.soft(body.data.updated_at).toContain("2025");
        expect.soft(body.data.uri).toBe("https://api.calendly.com/users/d831ff1b-b622-45e7-9dce-588198b3cee7");
        expect.soft(body.message).toBeNull();
    });

    // FLAKY TEST
    test("GET with valid credentials and integration off @happy", async ({ request }) => {
        // Company two should have empty calendly information
        const response = await request.get(`/api/v2/calendly/info`, {
            headers: authObjects.companyTwoAuthHeaders
        });
        expect.soft(response.status()).toBe(400);

        const body = await response.json();

        expect.soft(body.status, `Body Contains: ${JSON.stringify(body, null, 2)}`).toBe("FAILED");
        expect.soft(body.data).toEqual([]);
        expect.soft(body.message).toBe("Calendly Refresh Token Missing!");
    });

    test("GET with invalid credentials @security", async ({ request }) => {
        // Company two should not be able to access data from company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.get(`/api/v2/calendly/info`, {
            headers: maliciousHeaders
        });
        expect.soft(response.status()).toBe(471);

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

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });
});