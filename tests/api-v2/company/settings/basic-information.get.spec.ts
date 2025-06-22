//GET: /api/v2/company/setting/basic-information

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/company/setting/basic-information GET requests @company", async () => {
    test("GET with valid credentials @happy", async ({ request }) => {
        // Get the basic description
        const response = await request.get(`/api/v2/company/setting/basic-information`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect.soft(body.status).toBe("SUCCESS");
        expect.soft(body.data.company.name).toBe("Company One");
        expect.soft(body.data.company.username).toBe("com01");
        expect.soft(body.data.company.mobile_number).toBe("01558987890");
        expect.soft(body.data.company.company_type.id).toBe(6);
        expect.soft(body.data.company.company_type.name).toBe("Education & Training");
        expect.soft(body.data.company.website).toBe("https://c1.hurayraiit.com");
        expect.soft(body.data.company.company_size).toBe(1);
        expect.soft(body.data.company.time_zone).toBe("Asia/Dhaka");
        expect.soft(body.data.company.jobs_per_page).toBe("5");
        expect.soft(body.data.companyAddress.id).toBe(7928);
        expect.soft(body.data.companyAddress.type).toBe("1");
        expect.soft(body.data.companyAddress.country_id).toBe(18);
        expect.soft(body.data.companyAddress.state_id).toBe(348);
        expect.soft(body.data.companyAddress.city_id).toBe(48397);
        expect.soft(body.data.companyAddress.postal_code).toBe("1111");
        expect.soft(body.data.companyAddress.address_line_1).toBeNull();
        expect.soft(body.data.companyAddress.address_line_2).toBeNull();
        expect.soft(body.data.companyAddress.model_id).toBe(2321);
        expect.soft(body.data.companyAddress.model_type).toBe("App\\Models\\Company");
        expect.soft(body.data.companyAddress.country.id).toBe(18);
        expect.soft(body.data.companyAddress.country.name).toBe("Bangladesh");
        expect.soft(body.data.companyAddress.state.id).toBe(348);
        expect.soft(body.data.companyAddress.state.name).toBe("Dhaka");
        expect.soft(body.data.companyAddress.city.id).toBe(48397);
        expect.soft(body.data.companyAddress.city.name).toBe("Mirpur DOHS");
        expect.soft(body.data.lang).toBe("en");
        expect.soft(body.message).toBeNull();
    });

    test("GET with invalid credentials", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/basic-information`, {
            headers: {
                "Accept": "application/json",
            }
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe("Unauthenticated.");
    });

    test("GET with valid credentials but another company ID @security", async ({ request }) => {
        // Company two should not be able to access data from company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.get(`/api/v2/company/setting/basic-information`, {
            headers: maliciousHeaders
        });

        expect.soft(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("GET with candidate auth @security", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/basic-information`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });
});