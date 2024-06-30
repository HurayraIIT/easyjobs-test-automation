// DELETE: /api/v2/candidate/employment/{employment}/delete

import { test, expect } from '@playwright/test';
import { createAuthHeaders } from '@datafactory/auth';
import { createCandidateEmployment, deleteAllEmployments } from '@datafactory/employment';

test.describe("/api/v2/candidate/employment/{employment}/delete DELETE requests @candidate", async () => {
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

    test("DELETE with valid employment id and valid token @happy", async ({ request }) => {
        const employment = await createCandidateEmployment(authHeaders);
        const response = await request.delete(`/api/v2/candidate/employment/${employment.data.id}/delete`, {
            headers: authHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.status).toBe('SUCCESS');
        expect(body.message).toBe('Deleted.');
    });

    test("DELETE with already deleted employment id", async ({ request }) => {
        // First create and delete an employment
        const employment = await createCandidateEmployment(authHeaders);
        const response = await request.delete(`/api/v2/candidate/employment/${employment.data.id}/delete`, {
            headers: authHeaders
        });

        expect(response.status()).toBe(200);

        // Now try to delete the same employment again
        const response2 = await request.delete(`/api/v2/candidate/employment/${employment.data.id}/delete`, {
            headers: authHeaders
        });

        expect(response2.status()).toBe(200);

        const body = await response2.json();
        expect(body.status).toBe('SUCCESS');
        expect(body.message).toBe('Deleted.');
    });

    test("DELETE with valid employment id and invalid token", async ({ request }) => {
        const employment = await createCandidateEmployment(authHeaders);
        const response = await request.delete(`/api/v2/candidate/employment/${employment.data.id}/delete`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });

    // TODO: Report Issue: Response status should be 400
    test("DELETE with invalid int employment id and valid token", async ({ request }) => {
        const response = await request.delete(`/api/v2/candidate/employment/12345/delete`, {
            headers: authHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.status).toBe('SUCCESS');
        expect(body.message).toBe('Deleted.');
    });

    // TODO: Report Issue: Response status should be 400
    test("DELETE with invalid string employment id and valid token", async ({ request }) => {
        const response = await request.delete(`/api/v2/candidate/employment/abcdef/delete`, {
            headers: authHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.status).toBe('SUCCESS');
        expect(body.message).toBe('Deleted.');
    });
});