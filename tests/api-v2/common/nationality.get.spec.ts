// GET: /api/v2/nationality

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/nationality GET requests @company", async () => {
    test("GET with valid company credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/nationality`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.data[21].value).toBe("Bangladeshi");
        expect(body.data[21].text).toBe("Bangladeshi");
        expect(body.success).toBe(true);
    });

    test("GET with valid candidate credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/nationality`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.data[21].value).toBe("Bangladeshi");
        expect(body.data[21].text).toBe("Bangladeshi");
        expect(body.success).toBe(true);
    });

    test("GET without valid credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/nationality`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.data[21].value).toBe("Bangladeshi");
        expect(body.data[21].text).toBe("Bangladeshi");
        expect(body.success).toBe(true);
    });
});