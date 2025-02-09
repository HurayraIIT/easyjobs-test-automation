//POST: /api/v2/company/setting/basic-info

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

const data = {
    "company": {
        "name": "Company One",
        "username": "c1",
        "mobile_number": "01558987890",
        "company_type": { "id": 6, "name": "Education & Training" },
        "website": "https://c1.hurayraiit.com",
        "company_size": 1,
        "show_explore_company": true,
        "time_zone": "Asia/Dhaka",
        "show_job_filter": true,
        "jobs_per_page": "5",
        "show_location_filter": {
            "show_city": true,
            "show_state": true,
            "show_country": true,
            "show_location": true
        },
        "apply_google_index": false,
        "translate_user_input": false,
        "show_city_filter": true,
        "show_state_filter": true,
        "show_country_filter": true
    },
    "companyAddress": {
        "id": 5096,
        "type": "1",
        "country_id": null,
        "state_id": null,
        "city_id": null,
        "postal_code": "1111",
        "address_line_1": null,
        "address_line_2": null,
        "model_id": 2227,
        "model_type": "App\\Models\\Company",
        "country": {
            "id": 18,
            "sort_name": "BD",
            "name": "Bangladesh",
            "phone_code": "880",
            "nationality": "Bangladeshi"
        }, "state": {
            "id": 348,
            "name": "Dhaka"
        }, "city": {
            "id": 48397,
            "name": "Mirpur DOHS"
        }
    },
    "lang": {
        "image": "/app-easy-jobs/img/languages/004-united-states-of-america.svg",
        "name": "English",
        "code": "en",
        "extra": "",
        "title": "English"
    }
};

test.describe("/api/v2/company/setting/basic-info POST requests @company", async () => {
    test("POST with valid credentials @happy", async ({ request }) => {
        // POST the basic description
        const response = await request.post(`/api/v2/company/setting/basic-info`, {
            headers: authObjects.companyOneAuthHeaders,
            data: data
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.message).toBe("Company basic info updated.");
    });

    test("POST with invalid credentials", async ({ request }) => {
        const response = await request.post(`/api/v2/company/setting/basic-info`, {
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

        const response = await request.post(`/api/v2/company/setting/basic-info`, {
            headers: maliciousHeaders,
            data: data
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("POST with candidate auth", async ({ request }) => {
        const response = await request.post(`/api/v2/company/setting/basic-info`, {
            headers: authObjects.candidateOneAuthHeaders,
            data: data
        });

        expect(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });
});