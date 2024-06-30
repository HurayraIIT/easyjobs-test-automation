import { expect, request } from '@playwright/test';

export async function createAuthHeaders(email: any, password: any) {
    const requestContext = await request.newContext();
    const response = await requestContext.post('/api/v2/sign-in', {
        data: {
            "email": email,
            "password": password
        }
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe('SUCCESS');
    expect(body.message).toBe('Successfully logged in');
    expect(body.data.email).toBe(email);

    return {
        'Authorization': `Bearer ${body['data']['token'] ?? ''}`,
        'State-Version': `${body['data']['state_version'] ?? ''}`,
        'Company-Id': `${body['data']['current_company'] ?? ''}`,
        "Accept": "application/json"
    };
};