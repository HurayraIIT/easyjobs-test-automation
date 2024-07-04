import { expect, request } from '@playwright/test';

/**
 * Creates authorization headers by logging in with the provided email and password.
 * 
 * @param {string} email - The email address used for authentication.
 * @param {string} password - The password used for authentication.
 * @returns {Promise<{ [key: string]: string }>} A promise that resolves to an object containing the authorization headers.
 * 
 * @example
 * const companyEmail = `${process.env.COMPANY_EMAIL}`;
 * const companyPassword = `${process.env.COMPANY_PASSWORD}`;
 * const headers = await createAuthHeaders(companyEmail, companyPassword);
 * console.log(headers);
 * // {
 * //   'Authorization': 'Bearer some_token',
 * //   'State-Version': '0',
 * //   'Company-Id': '1234',
 * //   'Accept': 'application/json',
 * //   'Cookie': 'time_zone=Asia/Dhaka; ej_token=some_token'
 * // }
 */
export async function createAuthHeaders(email: any, password: any): Promise<{ [key: string]: string }> {
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
        "Accept": "application/json",
        "Cookie": `time_zone=Asia/Dhaka; ej_token=${body['data']['token'] ?? ''}`
    };
};

/**
 * Authenticates a user and retrieves an authentication token.
 * 
 * @param {string} email - The email address used for authentication.
 * @param {string} password - The password used for authentication.
 * @returns {Promise<string>} A promise that resolves to the authentication token.
 * 
 * @example
 * const companyEmail = `${process.env.COMPANY_EMAIL}`;
 * const companyPassword = `${process.env.COMPANY_PASSWORD}`;
 * const token = await createAuthToken('companyEmail, companyPassword);
 * console.log(token); // 'some_auth_token'
 */
export async function createAuthToken(email: any, password: any): Promise<string> {
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

    return `${body['data']['token'] ?? ''}`;
};