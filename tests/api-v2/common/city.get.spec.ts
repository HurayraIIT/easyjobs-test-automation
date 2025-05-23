// GET: /api/v2/city/18/348

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/city/18/348 GET requests @company", async () => {
    test("GET with valid company credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/city/18/348`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body[0].group_name).toBe("Default City");
        expect(body[0].opts[1].id).toBe(7291);
        expect(body[0].opts[1].name).toBe("Dhaka");
        expect(body[0].opts[5].id).toBe(48397);
        expect(body[0].opts[5].name).toBe("Mirpur DOHS");
        expect(body[0].opts[6].id).toBe(48391);
        expect(body[0].opts[6].name).toBe("Narayanganj");
    });

    test("GET with valid candidate credentials", async ({ request }) => {
        const response = await request.get(`/api/v2/city/18/348`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect.soft(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("GET without valid credentials", async ({ request }) => {
        const response = await request.get(`/api/v2/city/18/348`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect.soft(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });
});