// DELETE: /api/v2/candidate/employment/{employment}/delete

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from '@helpers/createAssertions';
import { createCandidateEmployment, deleteAllEmployments } from '@datafactory/employment';

test.describe("/api/v2/candidate/employment/{employment}/delete DELETE requests @candidate", async () => {
    test.beforeAll(async () => {
        await deleteAllEmployments(authObjects.candidateOneAuthHeaders);
    });

    test("DELETE with valid employment id and valid token @happy", async ({ request }) => {
        const employment = await createCandidateEmployment(authObjects.candidateOneAuthHeaders);
        const response = await request.delete(`/api/v2/candidate/employment/${employment.data.id}/delete`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Deleted.");
    });

    // TODO: Report issue, response status should be 400
    test("DELETE with valid employment id but another candidate @security", async ({ request }) => {
        const employment = await createCandidateEmployment(authObjects.candidateOneAuthHeaders);
        const response = await request.delete(`/api/v2/candidate/employment/${employment.data.id}/delete`, {
            headers: authObjects.candidateTwoAuthHeaders
        });

        expect.soft(response.status()).toBe(200);
        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Deleted.");
    });

    test("DELETE with valid employment id but company auth @security", async ({ request }) => {
        const employment = await createCandidateEmployment(authObjects.candidateOneAuthHeaders);
        const response = await request.delete(`/api/v2/candidate/employment/${employment.data.id}/delete`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(480);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });

    test("DELETE with already deleted employment id", async ({ request }) => {
        // First create and delete an employment
        const employment = await createCandidateEmployment(authObjects.candidateOneAuthHeaders);
        const response = await request.delete(`/api/v2/candidate/employment/${employment.data.id}/delete`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        // Now try to delete the same employment again
        const response2 = await request.delete(`/api/v2/candidate/employment/${employment.data.id}/delete`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect(response2.status()).toBe(200);

        const body = await response2.json();

        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Deleted.");
    });

    test("DELETE with valid employment id and invalid token", async ({ request }) => {
        const employment = await createCandidateEmployment(authObjects.candidateOneAuthHeaders);
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
            headers: authObjects.candidateOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Deleted.");
    });

    // TODO: Report Issue: Response status should be 400
    test("DELETE with invalid string employment id and valid token", async ({ request }) => {
        const response = await request.delete(`/api/v2/candidate/employment/abcdef/delete`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Deleted.");
    });
});