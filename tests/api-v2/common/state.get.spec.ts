// GET: /api/v2/state/18

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/state/18 GET requests @company", async () => {
    test("GET with valid company credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/state/18`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body[0].group_name).toBe("Default State");
        expect(body[0].opts[0].id).toBe(337);
        expect(body[0].opts[0].name).toBe("Bagerhat");
        expect(body[0].opts[1].id).toBe(338);
        expect(body[0].opts[1].name).toBe("Bandarban");
    });

    test("GET with valid company credentials but invalid country", async ({ request }) => {
        const response = await request.get(`/api/v2/state/99999`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        expect(body).toStrictEqual([]);
    });

    test("GET with valid candidate credentials", async ({ request }) => {
        const response = await request.get(`/api/v2/state/18`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("GET without valid credentials", async ({ request }) => {
        const response = await request.get(`/api/v2/state/18`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });
});