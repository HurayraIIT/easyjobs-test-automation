// GET: /api/v2/city/18/348

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/city/18/348 GET requests @company", async () => {
    test("GET with valid company credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/city/18/348`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(200);

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

    test("GET with valid candidate credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/city/18/348`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect(response.status()).toBe(200);

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

    test("GET without valid credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/city/18/348`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect(response.status()).toBe(200);

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
});