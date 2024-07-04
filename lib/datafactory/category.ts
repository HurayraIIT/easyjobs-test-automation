import { expect, request } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { createAssertions } from '@helpers/createAssertions';

/**
 * Generates random category data.
 * @returns A promise that resolves to an object containing the generated category data.
 */
export async function getRandomCategoryData(): Promise<{ id: any; category_name: string; }> {
    const name = `${faker.commerce.department()} 🇧🇩 ${new Date().getTime()}`;
    return {
        "id": null,
        "category_name": name
    };
}

export async function createCategory(authHeaders: any) {
    const category_data = await getRandomCategoryData();

    const requestContext = await request.newContext();
    const response = await requestContext.post('/api/v2/company/setting/category/save', {
        data: category_data,
        headers: authHeaders
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    //await createAssertions(body);
    expect(body.status).toBe("SUCCESS");
    expect(body.message).toBe("Category added.");

    return body.data;
}

export async function getAllCategories(authHeaders: any) {
    let all_categories: any;
    const requestContext = await request.newContext();
    const response = await requestContext.get('/api/v2/company/setting/category?page=1', {
        headers: authHeaders
    });

    expect(response.status()).toBe(200);

    let body = await response.json();
    all_categories = body.data.data;
    let total_categories = body.data.total;

    for (let current_page = 2; current_page <= body.data.last_page; current_page++) {
        const response = await requestContext.get(`/api/v2/company/setting/category?page=${current_page}`, {
            headers: authHeaders
        });
        expect(response.status()).toBe(200);
        let body2 = await response.json();
        all_categories = all_categories.concat(body2.data.data);
    }

    expect(all_categories.length).toBe(total_categories);
    return all_categories;
}

export async function deleteCategoryById(authHeaders: any, id: number) {
    const requestContext = await request.newContext();
    const response = await requestContext.delete(`/api/v2/company/setting/category/${id}`, {
        headers: authHeaders
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    //await createAssertions(body);
    expect(body.status).toBe("SUCCESS");
    expect(body.message).toBe("Category deleted.");
}

/**
 * Deletes all categories.
 * @param authHeaders - The authentication headers.
 * @returns A Promise that resolves when all categories are deleted.
 */
export async function deleteAllCategories(authHeaders: any): Promise<void> {
    const categories = await getAllCategories(authHeaders);
    for (let category of categories) {
        await deleteCategoryById(authHeaders, category.id);
    }
}

/**
 * Creates multiple categories in bulk.
 * 
 * @param authHeaders - The authentication headers.
 * @param count - The number of categories to create.
 * @returns A Promise that resolves when all categories are created.
 */
export async function createBulkCategories(authHeaders: any, count: number): Promise<void> {
    let category: any;
    for (let i = 0; i < count; i++) {
        category = await createCategory(authHeaders);
        expect(category.id).toBeGreaterThan(0);
    }
}