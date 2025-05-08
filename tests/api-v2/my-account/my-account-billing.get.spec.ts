//GET: /api/v2/my-account/billing

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/my-account/billing GET requests @my-account", async () => {
    test("GET with valid credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/my-account/billing`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.payment_info.stripe_id).toBe("cus_Rl8vkrJrZyYHIh");
        expect(body.data.payment_info.card_holder_name).toContain("Abu Hurayra");
        expect(body.data.payment_info.card_brand).toBe("mastercard");
        expect(body.data.payment_info.card_last_four).toBe("4444");
        expect(body.data.billing.name).toBe("Company One");
        expect(body.data.billing.email).toBe(`${process.env.COMPANY_ONE_EMAIL}`);
        expect(body.message).toBeNull();
    });

    test("GET with another company ID @security", async ({ request }) => {
        // Company two should not be able to see company one info
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.get(`/api/v2/my-account/billing`, {
            headers: maliciousHeaders
        });

        expect.soft(response.status()).toBe(471);

        const data = await response.json();
        // await createAssertions(data);
        expect(data.status).toBe("FAILED");
        expect(data.data).toEqual([]);
        expect(data.message).toBe("Something went wrong.");
    });

    test("GET without auth", async ({ request }) => {
        const response = await request.get(`/api/v2/my-account/billing`, {
            headers: {
                "Accept": "application/json",
                "Company_Id": "2227"
            }
        });

        expect.soft(response.status()).toBe(401);

        const data = await response.json();
        // await createAssertions(data);
        expect(data.message).toBe("Unauthenticated.");
    });

    test("GET with candidate auth", async ({ request }) => {
        const response = await request.get(`/api/v2/my-account/billing`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect.soft(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });
});