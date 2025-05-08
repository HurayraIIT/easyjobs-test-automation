import { expect, request } from '@playwright/test';
import { faker } from '@faker-js/faker';

/**
 * Key = WordPress App Key here: https://app.easyjobs.dev/company/setting/others/integration
 */

export async function createCompanySettingsKey(authHeaders: any) {
    const requestContext = await request.newContext();
    const response = await requestContext.post('/api/v2/company/setting/key/create', {
        data: { "label": `Key: ${faker.company.name()}`, "type": 1 },
        headers: authHeaders
    });

    expect.soft(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("SUCCESS");
    return body.data;
}

export async function deleteCompanySettingsKeyById(authHeaders: any, id: number) {
    const requestContext = await request.newContext();
    const response = await requestContext.delete(`/api/v2/company/setting/key/${id}/delete?type=1`, {
        headers: authHeaders
    });

    expect.soft(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("SUCCESS");
}

export async function deleteAllCompanySettingsKeys(authHeaders: any) {
    const requestContext = await request.newContext();
    const response = await requestContext.get('/api/v2/company/setting/key?type=1', {
        headers: authHeaders
    });

    expect.soft(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("SUCCESS");

    for (const key of body.data) {
        await deleteCompanySettingsKeyById(authHeaders, key.id);
    }
}