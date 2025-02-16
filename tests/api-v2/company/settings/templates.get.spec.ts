//GET: /api/v2/company/setting/templates

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/company/setting/templates GET requests @company", async () => {
    test("GET with valid credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/templates`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toContain("SUCCESS");
        expect(body.data[0].id).toBe(1);
        expect(body.data[0].name).toContain("Default");
        expect(body.data[0].slug).toContain("default");
        expect(body.data[0].selected).toBe(true);
        expect(body.data[0].url).toContain("/app-easy-jobs/img/templates/default.jpg");
        expect(body.data[0].preview).toContain("/preview?template_slug=default&domain=app.easyjobs.dev");
        expect(body.data[1].id).toBe(2);
        expect(body.data[1].name).toContain("Classic");
        expect(body.data[1].slug).toContain("classic");
        expect(body.data[1].selected).toBe(false);
        expect(body.data[1].url).toContain("/app-easy-jobs/img/templates/classic.jpg");
        expect(body.data[1].preview).toContain("/preview?template_slug=classic&domain=app.easyjobs.dev");
        expect(body.data[2].id).toBe(3);
        expect(body.data[2].name).toContain("Elegant");
        expect(body.data[2].slug).toContain("elegant");
        expect(body.data[2].selected).toBe(false);
        expect(body.data[2].url).toContain("/app-easy-jobs/img/templates/elegant.jpg");
        expect(body.data[2].preview).toContain("/preview?template_slug=elegant&domain=app.easyjobs.dev");
        expect(body.message).toBeNull();
    });

    test("GET with invalid credentials", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/templates`, {
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
        // maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.get(`/api/v2/company/setting/templates`, {
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
        const response = await request.get(`/api/v2/company/setting/templates`, {
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