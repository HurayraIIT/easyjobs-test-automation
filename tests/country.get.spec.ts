// GET: /api/v2/country

import { test, expect } from '@playwright/test';
import { createAuthHeaders } from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/country GET requests @company", async () => {
    const companyEmail = `${process.env.COMPANY_ONE_EMAIL}`;
    const companyPassword = `${process.env.PASSWORD}`;

    test("GET with valid credentials @happy", async ({ request }) => {
        let authHeaders = await createAuthHeaders(companyEmail, companyPassword);
        const response = await request.get(`/api/v2/country`, {
            headers: authHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        // await createAssertions(body);
        expect(body[0].id).toBe(1);
        expect(body[0].sort_name).toBe("AF");
        expect(body[0].name).toBe("Afghanistan");
        expect(body[0].phone_code).toBe("93");
        expect(body[0].nationality).toBe("Afghan");

        expect(body[246].id).toBe(246);
        expect(body[246].sort_name).toBe("ZW");
        expect(body[246].name).toBe("Zimbabwe");
        expect(body[246].phone_code).toBe("263");
        expect(body[246].nationality).toBe("Zimbabwean");
    });

    test("GET without valid credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/country`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        // await createAssertions(body);
        expect(body[0].id).toBe(1);
        expect(body[0].sort_name).toBe("AF");
        expect(body[0].name).toBe("Afghanistan");
        expect(body[0].phone_code).toBe("93");
        expect(body[0].nationality).toBe("Afghan");

        expect(body[246].id).toBe(246);
        expect(body[246].sort_name).toBe("ZW");
        expect(body[246].name).toBe("Zimbabwe");
        expect(body[246].phone_code).toBe("263");
        expect(body[246].nationality).toBe("Zimbabwean");
    });
});