// POST: /api/v2/forgot-password

import { test, expect } from '@playwright/test';

test.describe("/api/v2/forgot-password POST requests @auth", async () => {
    const companyEmail = process.env.COMPANY_EMAIL;

    test("POST with valid email @happy", async ({ request }) => {
        const response = await request.post('/api/v2/forgot-password', {
            data: {
                "email": companyEmail
            }
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.status).toBe('SUCCESS');
        expect(body.message).toBe('A fresh verification link has been sent to your email address.');
    });

    test("POST with invalid email", async ({ request }) => {
        const response = await request.post('/api/v2/forgot-password', {
            data: {
                "email": "invalid-email@gmail.com"
            }
        });

        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.status).toBe('FAILED');
        expect(body.message).toBe('Email not exists.');
    });

    test("POST with empty email", async ({ request }) => {
        const response = await request.post('/api/v2/forgot-password', {
            data: {
                "email": ""
            }
        });

        expect(response.status()).toBe(422);
        const body = await response.json();
        expect(body.status).toBe('FAILED');
        expect(body.message.email[0]).toBe('The email field is required.');
    });

    test("POST with empty body", async ({ request }) => {
        const response = await request.post('/api/v2/forgot-password', {
            data: {}
        });

        expect(response.status()).toBe(422);
        const body = await response.json();
        expect(body.status).toBe('FAILED');
        expect(body.message.email[0]).toBe('The email field is required.');
    });

    test("POST with no body", async ({ request }) => {
        const response = await request.post('/api/v2/forgot-password');

        expect(response.status()).toBe(422);
        const body = await response.json();
        expect(body.status).toBe('FAILED');
        expect(body.message.email[0]).toBe('The email field is required.');
    });
});