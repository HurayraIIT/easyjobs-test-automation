// POST: /api/v2/logout

import { test, expect } from '@playwright/test';
import { createAuthHeaders } from '../../lib/datafactory/auth';

test.describe("/api/v2/logout POST requests @auth", async () => {
    const companyEmail = process.env.COMPANY_EMAIL;
    const companyPassword = process.env.COMPANY_PASSWORD;
    let authHeaders: any;

    test.beforeEach(async () => {
        authHeaders = await createAuthHeaders(companyEmail, companyPassword);
    });

    test("POST with valid headers @happy", async ({ request }) => {
        const response = await request.post('/api/v2/logout', {
            headers: authHeaders
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.status).toBe('SUCCESS');
        expect(body.message).toBe('Success');
    });

    test("POST with invalid headers", async ({ request }) => {
        const response = await request.post('/api/v2/logout', {
            headers: {
                "Authorization": "Bearer invalid-token",
                "Company-Id": "",
                "State-Version": "",
                "Accept": "application/json"
            }
        });

        expect(response.status()).toBe(401);
        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });

    test("POST with same header after performing logout once", async ({ request }) => {
        // First logout
        const first_response = await request.post('/api/v2/logout', {
            headers: authHeaders
        });

        expect(first_response.status()).toBe(200);
        const first_body = await first_response.json();
        expect(first_body.status).toBe('SUCCESS');
        expect(first_body.message).toBe('Success');

        // wait for 2 seconds
        await new Promise(r => setTimeout(r, 2000));

        // Now re-use the headers
        const response = await request.post('/api/v2/logout', {
            headers: authHeaders
        });

        expect(response.status()).toBe(401);
        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });
});