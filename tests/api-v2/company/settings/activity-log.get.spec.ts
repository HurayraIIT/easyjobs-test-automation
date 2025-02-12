//GET: /api/v2/company/setting/activity-log

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/company/setting/activity-log GET requests @company", async () => {
    test("GET with valid credentials and without filters @happy", async ({ request }) => {
        // Get the activity log
        const response = await request.get(`/api/v2/company/setting/activity-log`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body.data);
        expect(body.status).toBe("SUCCESS");
        expect(body.message).toBeNull();
    });

    test("GET with valid credentials and filters @happy", async ({ request }) => {
        // Get the activity log
        const response = await request.get(`/api/v2/company/setting/activity-log?log_type=COMPANY&search_query=updated&page=1`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body.data);
        expect(body.status).toBe("SUCCESS");
        expect(body.message).toBeNull();

        expect(body.data.current_page).toBe(1);
        expect(body.data.data[0].logname).toBe("updated");
        expect(body.data.data[0].user_name).toBe("Company One");
        expect(body.data.data[0].log_class).toBe("warning");
        expect(body.data.data[0].description).toContain("activity_company_user_updated");
        expect(body.data.data[0].keys.USER_NAME).toBe("Company One");
        // expect(body.data.data[0].fields).toEqual([]);
        expect(body.data.data[0].model).toBe("COMPANY");
    });

    test("GET with invalid credentials", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/activity-log`, {
            headers: {
                "Accept": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe("Unauthenticated.");
    });

    test("GET with valid credentials but another company ID @security", async ({ request }) => {
        // Company two should not be able to access data from company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.get(`/api/v2/company/setting/activity-log`, {
            headers: maliciousHeaders
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("GET with candidate auth", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/activity-log`, {
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