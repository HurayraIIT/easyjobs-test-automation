// GET: /api/v2/job/skill

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createCategory, deleteAllCategories, deleteCategoryById, getAllCategories } from '@datafactory/category';

test.describe("/api/v2/job/skill GET requests @company", async () => {
    test("GET with valid company credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/job/skill`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        // console.log(body[1]);
        // await createAssertions(body[1]);
        expect(body[0].group_name).toBe("Default Skills");
        expect(body[0].opts[35].id).toBe(321);
        expect(body[0].opts[35].name).toBe("algorithms");
    });

    test("GET with valid candidate credentials", async ({ request }) => {
        const response = await request.get(`/api/v2/job/skill`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect(response.status()).toBe(480);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });

    test("GET without auth token", async ({ request }) => {
        const response = await request.get(`/api/v2/job/skill`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });
});