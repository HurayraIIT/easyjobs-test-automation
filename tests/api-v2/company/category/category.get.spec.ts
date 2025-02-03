// GET: /api/v2/company/setting/category

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createCategory, deleteAllCategories, deleteCategoryById, getAllCategories } from '@datafactory/category';

test.describe("/api/v2/company/setting/category GET requests @company", async () => {
    test("GET with valid credentials @happy", async ({ request }) => {
        const category = await createCategory(authObjects.companyOneAuthHeaders);
        let all_categories = await getAllCategories(authObjects.companyOneAuthHeaders);
        let flag = 0;
        for (let cat of all_categories) {
            if (cat.id === category.id) {
                flag = 1;
                expect(cat.name).toBe(category.name);
                expect(cat.created_at).toBeTruthy();
                expect(cat.updated_at).toBeTruthy();
                expect(cat.parent_id).toBeNull();
                expect(cat.company_id).toBeGreaterThan(0);
                expect(cat.use_count).toBeGreaterThanOrEqual(0);
            }
        }
        expect(flag).toBe(1);
        await deleteCategoryById(authObjects.companyOneAuthHeaders, category.id);
    });

    test("GET without auth token", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/category`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });
});