import { expect, request } from '@playwright/test';
import { faker } from '@faker-js/faker';

export async function getAllUsers(authHeaders: any) {
    const requestContext = await request.newContext();
    const response = await requestContext.get('/api/v2/company/setting/user', {
        headers: authHeaders
    });

    expect(response.status()).toBe(200);

    let body = await response.json();
    return body.data;
}

export async function deleteUserById(authHeaders: any, id: number) {
    const requestContext = await request.newContext();
    const response = await requestContext.delete(`/api/v2/company/setting/user/${id}/delete`, {
        headers: authHeaders
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("SUCCESS");
}

export async function deleteAllUsers(authHeaders: any) {
    const users = await getAllUsers(authHeaders);
    for (let user of users) {
        if (user.isOwner === false) {
            await deleteUserById(authHeaders, user.id);
        }
    }
}
