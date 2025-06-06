// GET: /api/v2/job/category

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createCategory, deleteAllCategories, deleteCategoryById, getAllCategories } from '@datafactory/category';
import { create } from 'domain';

test.describe("/api/v2/job/category GET requests @company", async () => {
    test("GET with valid company credentials @happy", async ({ request }) => {
        const new_category = await createCategory(authObjects.companyOneAuthHeaders);
        const response = await request.get(`/api/v2/job/category`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // console.log(body[0]);
        // await createAssertions(body[1]);
        expect(body[0].group_name).toBe("Custom Categories");
        expect(body[1].group_name).toBe("Default Categories");
        expect(body[1].opts[0].id).toBe(70);
        expect(body[1].opts[0].name).toBe("3D Animator");
    });

    test("GET with valid candidate credentials", async ({ request }) => {
        const response = await request.get(`/api/v2/job/category`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });

    test("GET without auth token", async ({ request }) => {
        const response = await request.get(`/api/v2/job/category`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });
});