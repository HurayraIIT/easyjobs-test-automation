//GET: /api/v2/company/setting/basic-info

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/company/setting/basic-info GET requests @company", async () => {
    test("GET with valid credentials @happy", async ({ request }) => {
        // Get the basic description
        const response = await request.get(`/api/v2/company/setting/basic-info`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.company.name).toBe("Company One");
        expect(body.data.company.username).toBe("c01");
        expect(body.data.company.mobile_number).toBe("01558987890");
        expect(body.data.company.company_type.id).toBe(6);
        expect(body.data.company.company_type.name).toBe("Education & Training");
        expect(body.data.company.website).toBe("https://c1.hurayraiit.com");
        expect(body.data.company.company_size).toBe(1);
        expect(body.data.company.time_zone).toBe("Asia/Dhaka");
        expect(body.data.company.jobs_per_page).toBe("5");
        expect(body.data.companyAddress.id).toBe(5172);
        expect(body.data.companyAddress.type).toBe("1");
        expect(body.data.companyAddress.country_id).toBe(18);
        expect(body.data.companyAddress.state_id).toBe(348);
        expect(body.data.companyAddress.city_id).toBe(48397);
        expect(body.data.companyAddress.postal_code).toBe("1111");
        expect(body.data.companyAddress.address_line_1).toBeNull();
        expect(body.data.companyAddress.address_line_2).toBeNull();
        expect(body.data.companyAddress.model_id).toBe(2239);
        expect(body.data.companyAddress.model_type).toBe("App\\Models\\Company");
        expect(body.data.companyAddress.country.id).toBe(18);
        expect(body.data.companyAddress.country.name).toBe("Bangladesh");
        expect(body.data.companyAddress.state.id).toBe(348);
        expect(body.data.companyAddress.state.name).toBe("Dhaka");
        expect(body.data.companyAddress.city.id).toBe(48397);
        expect(body.data.companyAddress.city.name).toBe("Mirpur DOHS");
        expect(body.data.lang).toBe("en");
        expect(body.message).toBeNull();
    });

    test("GET with invalid credentials", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/basic-info`, {
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
        // maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.get(`/api/v2/company/setting/basic-info`, {
            headers: maliciousHeaders
        });

        expect(response.status()).toBe(471);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("GET with candidate auth", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/basic-info`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });
});