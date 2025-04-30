//GET: /api/v2/company/setting/templates

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/company/setting/templates GET requests @company", async () => {
    test("GET with valid credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/templates`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect.soft(body.status).toContain("SUCCESS");
        expect.soft(body.data[0].id).toBe(1);
        expect.soft(body.data[0].name).toContain("Default");
        expect.soft(body.data[0].slug).toContain("default");
        expect.soft(body.data[0].selected).toBe(true);
        expect.soft(body.data[0].url).toContain("/app-easy-jobs/img/templates/default.jpg");
        expect.soft(body.data[0].preview).toContain("/preview?template_slug=default");
        expect.soft(body.data[1].id).toBe(2);
        expect.soft(body.data[1].name).toContain("Classic");
        expect.soft(body.data[1].slug).toContain("classic");
        expect.soft(body.data[1].selected).toBe(false);
        expect.soft(body.data[1].url).toContain("/app-easy-jobs/img/templates/classic.jpg");
        expect.soft(body.data[1].preview).toContain("/preview?template_slug=classic");
        expect.soft(body.data[2].id).toBe(3);
        expect.soft(body.data[2].name).toContain("Elegant");
        expect.soft(body.data[2].slug).toContain("elegant");
        expect.soft(body.data[2].selected).toBe(false);
        expect.soft(body.data[2].url).toContain("/app-easy-jobs/img/templates/elegant.jpg");
        expect.soft(body.data[2].preview).toContain("/preview?template_slug=elegant");
        expect.soft(body.message).toBeNull();
    });

    test("GET with invalid credentials", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/templates`, {
            headers: {
                "Accept": "application/json",
            }
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        expect.soft(body.message).toBe("Unauthenticated.");
    });

    test("GET with valid credentials but another company ID @security", async ({ request }) => {
        // Company two should not be able to access data from company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        // maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.get(`/api/v2/company/setting/templates`, {
            headers: maliciousHeaders
        });

        expect.soft(response.status()).toBe(471);

        const body = await response.json();
        // await createAssertions(body);
        expect.soft(body.status).toBe("FAILED");
        expect.soft(body.data).toEqual([]);
        expect.soft(body.message).toBe("Something went wrong.");
    });

    test("GET with candidate auth", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/templates`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect.soft(body.status).toBe("failed");
        expect.soft(body.data).toEqual([]);
        expect.soft(body.message).toBe("You do not have access permissions.");
    });
});