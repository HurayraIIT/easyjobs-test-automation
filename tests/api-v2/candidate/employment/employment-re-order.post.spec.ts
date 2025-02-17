// POST: /api/v2/candidate/employment/re-order

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from '@helpers/createAssertions';
import { createCandidateEmployment, deleteAllEmployments, getAllEmployments } from '@datafactory/employment';

test.describe("/api/v2/candidate/employment/re-order POST requests @candidate", async () => {
    test.beforeEach(async () => {
        await deleteAllEmployments(authObjects.candidateOneAuthHeaders);
    });

    test("POST re-order employments with valid token @happy", async ({ request }) => {
        // Create 3 employments
        const employment_0 = await createCandidateEmployment(authObjects.candidateOneAuthHeaders);
        const employment_1 = await createCandidateEmployment(authObjects.candidateOneAuthHeaders);
        const employment_2 = await createCandidateEmployment(authObjects.candidateOneAuthHeaders);

        // Verify that the order is 0, 1, 2
        const all_employments = await getAllEmployments(authObjects.candidateOneAuthHeaders);

        expect(all_employments.data[0].id).toBe(employment_0.data.id);
        expect(all_employments.data[1].id).toBe(employment_1.data.id);
        expect(all_employments.data[2].id).toBe(employment_2.data.id);

        // Re-order the employments
        const response = await request.post(`/api/v2/candidate/employment/re-order`, {
            headers: authObjects.candidateOneAuthHeaders,
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
        const sorted_employments = await getAllEmployments(authObjects.candidateOneAuthHeaders);

        expect(sorted_employments.data[0].id).toBe(employment_2.data.id);
        expect(sorted_employments.data[1].id).toBe(employment_1.data.id);
        expect(sorted_employments.data[2].id).toBe(employment_0.data.id);
    });

    test("POST re-order employments with another candidate @security", async ({ request }) => {
        // Create 3 employments
        const employment_0 = await createCandidateEmployment(authObjects.candidateOneAuthHeaders);
        const employment_1 = await createCandidateEmployment(authObjects.candidateOneAuthHeaders);
        const employment_2 = await createCandidateEmployment(authObjects.candidateOneAuthHeaders);

        // Verify that the order is 0, 1, 2
        const all_employments = await getAllEmployments(authObjects.candidateOneAuthHeaders);

        expect(all_employments.data[0].id).toBe(employment_0.data.id);
        expect(all_employments.data[1].id).toBe(employment_1.data.id);
        expect(all_employments.data[2].id).toBe(employment_2.data.id);

        // Re-order the employments
        const response = await request.post(`/api/v2/candidate/employment/re-order`, {
            headers: authObjects.candidateTwoAuthHeaders,
            data: {
                "employments": [
                    employment_2.data,
                    employment_1.data,
                    employment_0.data
                ]
            }
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Unauthorized Access");
    });

    test("POST re-order employments with company auth @security", async ({ request }) => {
        // Create 3 employments
        const employment_0 = await createCandidateEmployment(authObjects.candidateOneAuthHeaders);
        const employment_1 = await createCandidateEmployment(authObjects.candidateOneAuthHeaders);
        const employment_2 = await createCandidateEmployment(authObjects.candidateOneAuthHeaders);

        // Re-order the employments
        const response = await request.post(`/api/v2/candidate/employment/re-order`, {
            headers: authObjects.companyOneAuthHeaders,
            data: {
                "employments": [
                    employment_2.data,
                    employment_1.data,
                    employment_0.data
                ]
            }
        });

        expect(response.status()).toBe(480);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });

    test("POST re-order employments with invalid token", async ({ request }) => {
        // Create 3 employments
        const employment_0 = await createCandidateEmployment(authObjects.candidateOneAuthHeaders);
        const employment_1 = await createCandidateEmployment(authObjects.candidateOneAuthHeaders);
        const employment_2 = await createCandidateEmployment(authObjects.candidateOneAuthHeaders);

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
            headers: authObjects.candidateOneAuthHeaders,
            data: {
                "employments": []
            }
        });

        expect(response.status()).toBe(422);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message.employments).toEqual(["The employments field is required."]);
    });

    test("POST re-order employments with empty data", async ({ request }) => {
        const response = await request.post(`/api/v2/candidate/employment/re-order`, {
            headers: authObjects.candidateOneAuthHeaders,
            data: {}
        });

        expect(response.status()).toBe(422);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message.employments).toEqual(["The employments field is required."]);
    });
});