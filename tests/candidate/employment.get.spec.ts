// GET: /api/v2/candidate/employment

import { test, expect } from '@playwright/test';
import { createAuthHeaders } from '@datafactory/auth';
import { createCandidateEmployment, deleteAllEmployments, deleteEmployment } from '@datafactory/employment';

test.describe("/api/v2/candidate/employment GET requests @candidate", async () => {
    const candidateEmail = `${process.env.CANDIDATE_EMAIL}`;
    const candidatePassword = `${process.env.CANDIDATE_PASSWORD}`;
    let authHeaders: any;

    test.beforeAll(async () => {
        authHeaders = await createAuthHeaders(candidateEmail, candidatePassword);
        await deleteAllEmployments(authHeaders);
    });

    test.beforeEach(async () => {
        authHeaders = await createAuthHeaders(candidateEmail, candidatePassword);
    });

    test("GET with valid credentials @happy", async ({ request }) => {
        const employment = await createCandidateEmployment(authHeaders);

        const response = await request.get(`/api/v2/candidate/employment?id=${employment.data.id}`, {
            headers: authHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.status).toBe('SUCCESS');
        expect(body.message).toBe(null);
        expect(body.data.id).toBe(employment.data.id);
        expect(body.data.designation).toBe(employment.data.designation);
        expect(body.data.company_name).toBe(employment.data.company_name);
        expect(body.data.department).toBe(employment.data.department);
        expect(body.data.from_date).toContain(employment.data.from.split('T')[0]);
        expect(body.data.to_date).toContain(employment.data.to.split('T')[0]);
        expect(body.data.is_currently_working).toBe(employment.data.is_currently_working);
        expect(body.data.responsibilities).toBe(employment.data.responsibilities);
    });

    test("GET without auth token", async ({ request }) => {
        const employment = await createCandidateEmployment(authHeaders);

        const response = await request.get(`/api/v2/candidate/employment?id=${employment.data.id}`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });

    test("GET after deleting", async ({ request }) => {
        const employment = await createCandidateEmployment(authHeaders);
        await deleteEmployment(authHeaders, employment.data.id);

        const response = await request.get(`/api/v2/candidate/employment?id=${employment.data.id}`, {
            headers: authHeaders
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.status).toBe('FAILED');
        expect(body.message).toBe('responses.employment.not_found');
    });

    test("GET with empty id", async ({ request }) => {
        const response = await request.get(`/api/v2/candidate/employment?id=`, {
            headers: authHeaders
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.status).toBe('FAILED');
        expect(body.message).toBe('responses.employment.not_found');
    });

    test("GET with string as id", async ({ request }) => {
        const response = await request.get(`/api/v2/candidate/employment?id=asd`, {
            headers: authHeaders
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        expect(body.status).toBe('FAILED');
        expect(body.message).toBe('responses.employment.not_found');
    });
});