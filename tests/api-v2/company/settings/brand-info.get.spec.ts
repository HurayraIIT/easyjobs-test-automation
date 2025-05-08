//GET: /api/v2/company/setting/brand-info

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/company/setting/brand-info GET requests @company", async () => {
    test("GET with valid company credentials @happy", async ({ request }) => {
        // Get the basic description
        const response = await request.get(`/api/v2/company/setting/brand-info`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // console.log(body);
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.logo).toBe("https://app.easyjobs.dev/app-easy-jobs/img/98x98.png");
        expect(body.data.favicon).toBe("https://app.easyjobs.dev/favicon.png");
        expect(body.data.hasLogo).toBe(false);
        expect(body.data.logoSize).toBeNull();
        expect(body.data.hasFavicon).toBe(false);
        expect(body.data.faviconSize).toBeNull();
        expect(body.data.remove_powered_by).toBe(true);
        expect(body.data.brand_color).toBe("#f36c29");
        expect(body.message).toBeNull();
    });

    test("GET with valid candidate credentials", async ({ request }) => {
        // Get the basic description
        const response = await request.get(`/api/v2/company/setting/brand-info`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();
        // console.log(body);
        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });

    test("GET without auth", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/brand-info`, {
            headers: {
                "Accept": "application/json",
            }
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe("Unauthenticated.");
    });

    test("GET with valid credentials but another company ID", async ({ request }) => {
        // Company two should not be able to access data from company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        // maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.get(`/api/v2/company/setting/brand-info`, {
            headers: maliciousHeaders
        });

        expect.soft(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });
});