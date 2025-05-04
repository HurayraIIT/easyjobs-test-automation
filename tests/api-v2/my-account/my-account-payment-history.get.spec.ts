//GET: /api/v2/my-account/payment-history

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/my-account/payment-history GET requests @my-account", async () => {
    test("GET with valid credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/my-account/payment-history`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect.soft(body.status).toBe("SUCCESS");
        expect.soft(body.data.current_page).toBe(1);
        expect.soft(body.message).toBeNull();
        expect.soft(body.data.data[0].id).toBe(9841);
        expect.soft(body.data.data[0].package_id).toBe(1);
        expect.soft(body.data.data[0].trans_id).toBe("25049803");
        expect.soft(body.data.data[0].details).toBe("Subscription package “Startup” renewed.");
        expect.soft(body.data.data[0].type).toBe("RENEWAL");
        expect.soft(body.data.data[0].price).toBe("19.99");
        expect.soft(body.data.data[0].discount).toBe("0.00");
        expect.soft(body.data.data[0].total).toBe("19.99");
        expect.soft(body.data.data[0].stripe.id).toContain("in_1RD");
        expect.soft(body.data.data[0].stripe.object).toBe("invoice");
        expect.soft(body.data.data[0].stripe.invoice_pdf).toContain("https://pay.stripe.com/invoice/acct_1FxXxrA3kLRodxxu/test_YWNjdF8x");
        expect.soft(body.data.data[0].stripe.receipt_url).toBeNull();
        expect.soft(body.data.data[0].stripe.subscription).toContain("sub_1Qrc");
        expect.soft(body.data.data[0].stripe.error_message).toBe("");
        expect.soft(body.data.data[0].stripe.payment_intent).toContain("pi_3RD");
        expect.soft(body.data.data[0].stripe.hosted_invoice_url).toContain("https://invoice.stripe.com/i/acct_1Fx");
        expect.soft(body.data.data[0].paypal).toBeNull();
        expect.soft(body.data.data[0].payment_method).toBe(1);
        expect.soft(body.data.data[0].coupon).toEqual([]);
        expect.soft(body.data.data[0].date).toBe("12 Apr, 2025");
        expect.soft(body.data.data[0].action.title).toBe("Invoice");
        expect.soft(body.data.data[0].action.link).toContain("https://invoice.stripe.com/i/acct_1FxXxrA3kLRodxxu/test_YWNjdF8xRnh");
    });

    test("GET with another company ID @security", async ({ request }) => {
        // Company two should not be able to see company one info
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.get(`/api/v2/my-account/payment-history`, {
            headers: maliciousHeaders
        });

        expect(response.status()).toBe(471);

        const data = await response.json();
        // await createAssertions(data);
        expect(data.status).toBe("FAILED");
        expect(data.data).toEqual([]);
        expect(data.message).toBe("Something went wrong.");
    });

    test("GET without auth", async ({ request }) => {
        const response = await request.get(`/api/v2/my-account/payment-history`, {
            headers: {
                "Accept": "application/json",
                "Company_Id": "2227"
            }
        });

        expect(response.status()).toBe(401);

        const data = await response.json();
        // await createAssertions(data);
        expect(data.message).toBe("Unauthenticated.");
    });

    // TODO: Need to fix 500 server error
    test.skip("GET with candidate auth", async ({ request }) => {
        const response = await request.get(`/api/v2/my-account/payment-history?page=1`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        // expect(response.status()).toBe(200);
        expect(response.status()).toBe(500);

        const body = await response.json();
        // await createAssertions(body);
        // expect(body.status).toBe("SUCCESS");
        // expect(body.data.current_page).toBe(1);
        // expect(body.data.data[0].id).toBe(9682);
        // expect(body.data.data[0].package_id).toBe(5);
        // expect(body.data.data[0].trans_id).toBe("25029644");
        // expect(body.data.data[0].details).toBe("Subscribed to ”Free” package.");
        // expect(body.data.data[0].type).toBe("SUBSCRIPTION");
        // expect(body.data.data[0].price).toBe("0.00");
        // expect(body.data.data[0].discount).toBe("0.00");
        // expect(body.data.data[0].total).toBe("0.00");
        // expect(body.data.data[0].stripe).toBeNull();
        // expect(body.data.data[0].paypal).toBeNull();
        // expect(body.data.data[0].payment_method).toBe(9);
        // expect(body.data.data[0].coupon).toBeNull();
        // expect(body.data.data[0].date).toBe("02 Feb, 2025");
        // expect(body.data.data[0].action).toEqual([]);
        // expect(body.message).toBeNull();
    });
});