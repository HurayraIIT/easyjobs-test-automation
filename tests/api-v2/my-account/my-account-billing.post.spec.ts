//POST: /api/v2/my-account/billing

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/my-account/billing POST requests @my-account", async () => {
    test("POST with valid credentials @happy", async ({ request }) => {
        const response = await request.post(`/api/v2/my-account/billing`, {
            headers: authObjects.companyOneAuthHeaders,
            data: {
                "street": "St Test",
                "country": { "id": 18, "sort_name": "BD", "name": "Bangladesh", "phone_code": "880", "nationality": "Bangladeshi" },
                "state": { "id": 348, "name": "Dhaka" }, "city": { "id": 48397, "name": "Mirpur DOHS" },
                "postal_code": "1234"
            }
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Billing information updated.");
    });

    test("POST with another company ID @security", async ({ request }) => {
        // Company two should not be able to update company one billing info
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.post(`/api/v2/my-account/billing`, {
            headers: maliciousHeaders,
            data: {
                "street": "St Test",
                "country": { "id": 18, "sort_name": "BD", "name": "Bangladesh", "phone_code": "880", "nationality": "Bangladeshi" },
                "state": { "id": 348, "name": "Dhaka" }, "city": { "id": 48397, "name": "Mirpur DOHS" },
                "postal_code": "1234"
            }
        });

        expect(response.status()).toBe(471);

        const data = await response.json();
        // await createAssertions(data);
        expect(data.status).toBe("FAILED");
        expect(data.data).toEqual([]);
        expect(data.message).toBe("Something went wrong.");
    });

    test("POST without auth", async ({ request }) => {
        const response = await request.post(`/api/v2/my-account/billing`, {
            headers: {
                "Accept": "application/json",
                "Company_Id": "2227"
            },
            data: {
                "street": "St Test",
                "country": { "id": 18, "sort_name": "BD", "name": "Bangladesh", "phone_code": "880", "nationality": "Bangladeshi" },
                "state": { "id": 348, "name": "Dhaka" }, "city": { "id": 48397, "name": "Mirpur DOHS" },
                "postal_code": "1234"
            }
        });

        expect(response.status()).toBe(401);

        const data = await response.json();
        // await createAssertions(data);
        expect(data.message).toBe("Unauthenticated.");
    });

    test("POST with candidate auth", async ({ request }) => {
        const response = await request.post(`/api/v2/my-account/billing`, {
            headers: authObjects.candidateOneAuthHeaders,
            data: {
                "street": "Candidate St Test",
                "country": { "id": 18, "sort_name": "BD", "name": "Bangladesh", "phone_code": "880", "nationality": "Bangladeshi" },
                "state": { "id": 348, "name": "Dhaka" }, "city": { "id": 48397, "name": "Mirpur DOHS" },
                "postal_code": "4422"
            }
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(data);
        expect(body.status).toBe("SUCCESS");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Billing information updated.");
    });
});