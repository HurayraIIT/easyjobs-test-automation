// POST: /api/v2/company/setting/category/save

import { test, expect } from "@playwright/test";
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { deleteCategoryById, getRandomCategoryData } from "@datafactory/category";

test.describe("/api/v2/company/setting/category/save POST requests @company", async () => {
    test("POST can create a new category and edit it @happy", async ({ request }) => {
        // Create a new category
        let category_data = await getRandomCategoryData();
        const response = await request.post('/api/v2/company/setting/category/save', {
            data: category_data,
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        //await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.name).toBe(category_data.category_name);
        expect(body.data.company_id).toBeGreaterThan(0);
        expect(body.data.updated_at).toBeTruthy();
        expect(body.data.created_at).toBeTruthy();
        expect(body.data.id).toBeGreaterThan(0);
        expect(body.message).toBe("Category added.");

        // Edit the category
        let new_category_data = await getRandomCategoryData();
        new_category_data.id = body.data.id;
        const new_response = await request.post('/api/v2/company/setting/category/save', {
            data: new_category_data,
            headers: authObjects.companyOneAuthHeaders
        });

        expect(new_response.status()).toBe(200);

        const new_body = await new_response.json();

        //await createAssertions(new_body);
        expect(new_body.status).toBe("SUCCESS");
        expect(new_body.data.id).toBe(body.data.id);
        expect(new_body.data.name).toBe(new_category_data.category_name);
        expect(new_body.data.created_at).toBeTruthy();
        expect(new_body.data.updated_at).toBeTruthy();
        expect(new_body.data.parent_id).toBeNull();
        expect(new_body.data.company_id).toBeGreaterThan(0);
        expect(new_body.message).toBe("Category updated.");

        // Delete the category
        await deleteCategoryById(authObjects.companyOneAuthHeaders, new_body.data.id);
    });

    test("POST with empty data", async ({ request }) => {
        const response = await request.post('/api/v2/company/setting/category/save', {
            data: {},
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(422);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message.category_name).toEqual(["The category name field is required."]);
    });

    test("POST with no data", async ({ request }) => {
        const response = await request.post('/api/v2/company/setting/category/save', {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(422);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message.category_name).toEqual(["The category name field is required."]);
    });

    test("POST with valid data but no auth", async ({ request }) => {
        // Create a new category
        let category_data = await getRandomCategoryData();
        const response = await request.post('/api/v2/company/setting/category/save', {
            data: category_data,
            headers: {
                "Accept": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();

        //await createAssertions(body);
        expect(body.message).toBe('Unauthenticated.');
    });

    test("POST with invalid id", async ({ request }) => {
        // Create a new category
        let category_data = await getRandomCategoryData();
        const response = await request.post('/api/v2/company/setting/category/save', {
            data: {
                ...category_data,
                id: 1234
            },
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(499);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Category not found.");
    });
});
