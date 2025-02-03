// POST: /api/v2/sign-up

import { test, expect } from '@playwright/test';

test.describe("/api/v2/sign-up POST requests @auth", async () => {
    const companyOneEmail = process.env.COMPANY_ONE_EMAIL;
    const password = process.env.PASSWORD;

    test("POST with invalid data", async ({ request }) => {
        const response = await request.post('/api/v2/sign-up', {
            data: {
                "first_name": "",
                "last_name": "",
                "email": companyOneEmail,
                "password": password,
                "password_confirmation": "asdasdasd",
                "time_zone": "Asia/Dhaka"
            }
        });

        expect(response.status()).toBe(422);
        const body = await response.json();
        expect(body.status).toBe('FAILED');
        expect(body.message.email[0]).toBe('The email has already been taken.');
        expect(body.message.password[0]).toBe('The password confirmation does not match.');
        expect(body.message.first_name[0]).toBe('The first name field is required.');
        expect(body.message.last_name[0]).toBe('The last name field is required.');
    });

    test("POST with empty data", async ({ request }) => {
        const response = await request.post('/api/v2/sign-up', {
            data: {}
        });

        expect(response.status()).toBe(422);
        const body = await response.json();
        expect(body.status).toBe('FAILED');
        expect(body.message.email[0]).toBe('The email field is required.');
        expect(body.message.password[0]).toBe('The password field is required.');
        expect(body.message.first_name[0]).toBe('The first name field is required.');
        expect(body.message.last_name[0]).toBe('The last name field is required.');
    });

    test("POST with no data", async ({ request }) => {
        const response = await request.post('/api/v2/sign-up');

        expect(response.status()).toBe(422);
        const body = await response.json();
        expect(body.status).toBe('FAILED');
        expect(body.message.email[0]).toBe('The email field is required.');
        expect(body.message.password[0]).toBe('The password field is required.');
        expect(body.message.first_name[0]).toBe('The first name field is required.');
        expect(body.message.last_name[0]).toBe('The last name field is required.');
    });
});