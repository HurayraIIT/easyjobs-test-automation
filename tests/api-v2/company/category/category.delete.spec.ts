// DELETE: /api/v2/company/setting/category/{id}

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from '@helpers/createAssertions';
import { createCategory, deleteAllCategories, deleteCategoryById } from '@datafactory/category';

test.describe("/api/v2/company/setting/category/{id} DELETE requests @company", async () => {
    test.afterAll(async () => {
        await deleteAllCategories(authObjects.companyOneAuthHeaders);
    });

    test("DELETE with valid category id and valid token @happy", async ({ request }) => {
        const category = await createCategory(authObjects.companyOneAuthHeaders);
        const response = await request.delete(`/api/v2/company/setting/category/${category.id}`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.id).toBe(category.id);
        expect(body.data.name).toBe(category.name);
        expect(body.data.created_at).toBeTruthy();
        expect(body.data.updated_at).toBeTruthy();
        expect(body.data.parent_id).toBeNull();
        expect(body.data.company_id).toBeGreaterThan(0);
        expect(body.message).toBe("Category deleted.");
    });

    test("DELETE with already deleted category id", async ({ request }) => {
        // First create and delete a category
        const category = await createCategory(authObjects.companyOneAuthHeaders);
        const response = await request.delete(`/api/v2/company/setting/category/${category.id}`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.id).toBe(category.id);

        // Now try to delete the same category again
        const response2 = await request.delete(`/api/v2/company/setting/category/${category.id}`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response2.status()).toBe(499);

        const body2 = await response2.json();

        // await createAssertions(body);
        expect(body2.status).toBe("FAILED");
        expect(body2.data).toEqual([]);
        expect(body2.message).toBe("Category not found.");
    });

    test("DELETE with valid category id and invalid token", async ({ request }) => {
        const category = await createCategory(authObjects.companyOneAuthHeaders);
        const response = await request.delete(`/api/v2/company/setting/category/${category.id}`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.message).toBe("Unauthenticated.");
    });

    test("DELETE with invalid int category id and valid token", async ({ request }) => {
        const response = await request.delete(`/api/v2/company/setting/category/1234`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(499);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Category not found.");
    });

    test("DELETE with invalid string category id and valid token", async ({ request }) => {
        const response = await request.delete(`/api/v2/company/setting/category/abcdef`, {
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