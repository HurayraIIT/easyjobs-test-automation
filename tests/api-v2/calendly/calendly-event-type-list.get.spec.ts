// GET: /api/v2/calendly/event-type-list

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/calendly/event-type-list GET requests @company @happy", async () => {
    test("GET with valid credentials and integration on @happy", async ({ request }) => {
        // Company one should have valid calendly event type information
        const response = await request.get(`/api/v2/calendly/event-type-list`, {
            headers: authObjects.companyOneAuthHeaders
        });
        expect(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data[0].id).toBe("https://calendly.com/hurayra-wpdeveloper/30min");
        expect(body.data[0].name).toBe("30 Minute Meeting");
        expect(body.data[1].id).toBe("https://calendly.com/hurayra-wpdeveloper/test-automation-event-250203");
        expect(body.data[1].name).toBe("Test Automation Event 250203");
        expect(body.message).toBeNull();
    });

    test("GET with valid credentials and integration off @happy", async ({ request }) => {
        // Company two should have empty calendly event type information
        const response = await request.get(`/api/v2/calendly/event-type-list`, {
            headers: authObjects.companyTwoAuthHeaders
        });
        expect(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Calendly Refresh Token Missing!");
    });

    test("GET with invalid credentials @security", async ({ request }) => {
        // Company two should not be able to access data from company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.get(`/api/v2/calendly/event-type-list`, {
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
        const response = await request.get(`/api/v2/calendly/event-type-list`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.message).toBe('Unauthenticated.');
    });
});