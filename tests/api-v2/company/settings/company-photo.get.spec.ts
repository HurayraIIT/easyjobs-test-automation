//GET: /api/v2/company/setting/company-photo

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/company/setting/company-photo GET requests @company", async () => {
    test("GET with valid credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/company-photo`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.logo).toContain("/app-easy-jobs/img/98x98.png");
        expect(body.data.admin_logo).toContain("/app-easy-jobs/img/98x98.png");
        expect(body.data.favicon).toContain("/favicon.png");
        expect(body.data.admin_favicon).toContain("/favicon.png");
        expect(body.data.cover_photo).toContain("/app-easy-jobs/img/1600x840.png");
        expect(body.data.showcase_photos_1).toContain("/app-easy-jobs/img/720x525.png");
        expect(body.data.showcase_photos_2).toContain("/app-easy-jobs/img/720x525.png");
        expect(body.data.showcase_photos_3).toContain("/app-easy-jobs/img/720x525.png");
        expect(body.data.showcase_photos_4).toContain("/app-easy-jobs/img/720x525.png");
        expect(body.data.showcase_photos_5).toContain("/app-easy-jobs/img/720x525.png");
        expect(body.data.brand_color).toContain("#f36c29");
        expect(body.data.meta_img).toContain("/app-easy-jobs/img/98x98.png");
        expect(body.message).toBeNull();
    });

    test("GET with invalid credentials", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/company-photo`, {
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
        // maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.get(`/api/v2/company/setting/company-photo`, {
            headers: maliciousHeaders
        });

        expect.soft(response.status()).toBe(471);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("GET with candidate auth", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/company-photo`, {
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