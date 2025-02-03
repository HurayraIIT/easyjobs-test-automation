// POST: /api/v2/sign-in

import { test, expect } from '@playwright/test';

test.describe("/api/v2/sign-in POST requests @auth", async () => {
    const companyOneEmail = process.env.COMPANY_ONE_EMAIL;
    const password = process.env.PASSWORD;

    let start: any;
    let end: any;
    let duration: any;

    test("POST with valid credentials", async ({ request }) => {
        // Calculating the time taken to execute the test
        start = Date.now();
        const response = await request.post('/api/v2/sign-in', {
            data: {
                "email": companyOneEmail,
                "password": password
            }
        });
        end = Date.now();
        duration = end - start;
        expect.soft(duration).toBeLessThan(1000);
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.status).toBe('SUCCESS');
        expect(body.message).toBe('Successfully logged in');
        expect(body.data.email).toBe(companyOneEmail);
    });

    test("POST with invalid email and password", async ({ request }) => {
        const response = await request.post('/api/v2/sign-in', {
            data: {
                "email": "invalid-email@gmail.com",
                "password": "invalid-password"
            }
        });

        expect(response.status()).toBe(404);

        const body = await response.json();
        expect(body.status).toBe('FAILED');
        expect(body.message).toBe('Email not exists.');
        expect(body.data.email).toBe('invalid-email@gmail.com');
    });

    test("POST with valid email and invalid password", async ({ request }) => {
        const response = await request.post('/api/v2/sign-in', {
            data: {
                "email": companyOneEmail,
                "password": "invalid-password"
            }
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.status).toBe('FAILED');
        expect(body.message).toBe('Password doesn\'t match.');
        expect(body.data.email).toBe(companyOneEmail);
    });

    test("POST with invalid email and valid password", async ({ request }) => {
        const response = await request.post('/api/v2/sign-in', {
            data: {
                "email": "invalid-email@gmail.com",
                "password": password
            }
        });

        expect(response.status()).toBe(404);

        const body = await response.json();
        expect(body.status).toBe('FAILED');
        expect(body.message).toBe('Email not exists.');
        expect(body.data.email).toBe('invalid-email@gmail.com');
    });

    test("POST with no email and valid password", async ({ request }) => {
        const response = await request.post('/api/v2/sign-in', {
            data: {
                "password": password
            }
        });

        expect(response.status()).toBe(422);

        const body = await response.json();
        expect(body.status).toBe('FAILED');
        expect(body.message.email[0]).toBe('The email field is required.');
    });

    test("POST with empty body", async ({ request }) => {
        const response = await request.post('/api/v2/sign-in', {
            data: {}
        });

        expect(response.status()).toBe(422);

        const body = await response.json();
        expect(body.status).toBe('FAILED');
        expect(body.message.email[0]).toBe('The email field is required.');
        expect(body.message.password[0]).toBe('The password field is required.');
    });

    test("POST with no body", async ({ request }) => {
        const response = await request.post('/api/v2/sign-in', {
            data: {}
        });

        expect(response.status()).toBe(422);

        const body = await response.json();
        expect(body.status).toBe('FAILED');
        expect(body.message.email[0]).toBe('The email field is required.');
        expect(body.message.password[0]).toBe('The password field is required.');
    });
});