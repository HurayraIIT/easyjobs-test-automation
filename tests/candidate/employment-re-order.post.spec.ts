// POST: /api/v2/candidate/employment/re-order

import { test, expect } from '@playwright/test';
import { createAuthHeaders } from '@datafactory/auth';
import { createCandidateEmployment, deleteAllEmployments, getAllEmployments } from '@datafactory/employment';

test.describe("/api/v2/candidate/employment/re-order POST requests @candidate", async () => {
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

    test("POST re-order employments with valid token @happy", async ({ request }) => {
        // Create 3 employments
        const employment_0 = await createCandidateEmployment(authHeaders);
        const employment_1 = await createCandidateEmployment(authHeaders);
        const employment_2 = await createCandidateEmployment(authHeaders);

        // Verify that the order is 0, 1, 2
        const all_employments = await getAllEmployments(authHeaders);

        expect(all_employments.data[0].id).toBe(employment_0.data.id);
        expect(all_employments.data[1].id).toBe(employment_1.data.id);
        expect(all_employments.data[2].id).toBe(employment_2.data.id);

        // Re-order the employments
        const response = await request.post(`/api/v2/candidate/employment/re-order`, {
            headers: authHeaders,
            data: {
                "employments": [
                    employment_2.data,
                    employment_1.data,
                    employment_0.data
                ]
            }
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.status).toBe('SUCCESS');
        expect(body.message).toBe('Sorted.');

        // Verify that the order is 2, 1, 0
        const sorted_employments = await getAllEmployments(authHeaders);

        expect(sorted_employments.data[0].id).toBe(employment_2.data.id);
        expect(sorted_employments.data[1].id).toBe(employment_1.data.id);
        expect(sorted_employments.data[2].id).toBe(employment_0.data.id);
    });

    test("POST re-order employments with invalid token", async ({ request }) => {
        // Create 3 employments
        const employment_0 = await createCandidateEmployment(authHeaders);
        const employment_1 = await createCandidateEmployment(authHeaders);
        const employment_2 = await createCandidateEmployment(authHeaders);

        // Re-order the employments
        const response = await request.post(`/api/v2/candidate/employment/re-order`, {
            headers: {
                "ACCEPT": "application/json",
            },
            data: {
                "employments": [
                    employment_2.data,
                    employment_1.data,
                    employment_0.data
                ]
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });

    test("POST re-order employments with empty employments", async ({ request }) => {
        const response = await request.post(`/api/v2/candidate/employment/re-order`, {
            headers: authHeaders,
            data: {
                "employments": []
            }
        });

        expect(response.status()).toBe(422);

        const body = await response.json();
        expect(body.status).toBe('FAILED');
        expect(body.message.employments[0]).toBe('The employments field is required.');
    });

    test("POST re-order employments with empty data", async ({ request }) => {
        const response = await request.post(`/api/v2/candidate/employment/re-order`, {
            headers: authHeaders,
            data: {}
        });

        expect(response.status()).toBe(422);

        const body = await response.json();
        expect(body.status).toBe('FAILED');
        expect(body.message.employments[0]).toBe('The employments field is required.');
    });
});