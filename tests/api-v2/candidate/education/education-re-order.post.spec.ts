// POST: /api/v2/candidate/education/re-order

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from '@helpers/createAssertions';
import { createEducation, deleteAllEducations, getAllEducations } from '@datafactory/education';

test.describe("/api/v2/candidate/education/re-order POST requests @candidate", async () => {
    test.beforeEach(async () => {
        await deleteAllEducations(authObjects.candidateOneAuthHeaders);
    });

    test("POST re-order educations with valid token @happy", async ({ request }) => {
        // Create 3 educations
        const education_0 = await createEducation(authObjects.candidateOneAuthHeaders);
        const education_1 = await createEducation(authObjects.candidateOneAuthHeaders);
        const education_2 = await createEducation(authObjects.candidateOneAuthHeaders);

        // Verify that the order is 0, 1, 2
        const all_educations = await getAllEducations(authObjects.candidateOneAuthHeaders);

        expect(all_educations.data[0].id).toBe(education_0.data.id);
        expect(all_educations.data[1].id).toBe(education_1.data.id);
        expect(all_educations.data[2].id).toBe(education_2.data.id);

        // Re-order the educations
        const response = await request.post(`/api/v2/candidate/education/re-order`, {
            headers: authObjects.candidateOneAuthHeaders,
            data: {
                "educations": [
                    education_2.data,
                    education_1.data,
                    education_0.data
                ]
            }
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        expect(body.status).toBe('SUCCESS');
        expect(body.message).toBe('Sorted.');

        // Verify that the order is 2, 1, 0
        const sorted_educations = await getAllEducations(authObjects.candidateOneAuthHeaders);

        expect(sorted_educations.data[0].id).toBe(education_2.data.id);
        expect(sorted_educations.data[1].id).toBe(education_1.data.id);
        expect(sorted_educations.data[2].id).toBe(education_0.data.id);
    });

    test("POST re-order educations with invalid token", async ({ request }) => {
        // Create 3 educations
        const education_0 = await createEducation(authObjects.candidateOneAuthHeaders);
        const education_1 = await createEducation(authObjects.candidateOneAuthHeaders);
        const education_2 = await createEducation(authObjects.candidateOneAuthHeaders);

        // Re-order the educations
        const response = await request.post(`/api/v2/candidate/education/re-order`, {
            headers: {
                "ACCEPT": "application/json",
            },
            data: {
                "educations": [
                    education_2.data,
                    education_1.data,
                    education_0.data
                ]
            }
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });

    test("POST re-order educations with another candidate @security", async ({ request }) => {
        // Create 3 educations
        const education_0 = await createEducation(authObjects.candidateOneAuthHeaders);
        const education_1 = await createEducation(authObjects.candidateOneAuthHeaders);
        const education_2 = await createEducation(authObjects.candidateOneAuthHeaders);

        // Re-order the educations
        const response = await request.post(`/api/v2/candidate/education/re-order`, {
            headers: authObjects.candidateTwoAuthHeaders,
            data: {
                "educations": [
                    education_2.data,
                    education_1.data,
                    education_0.data
                ]
            }
        });

        expect.soft(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Unauthorized Access");
    });

    test("POST re-order educations with company auth @security", async ({ request }) => {
        // Create 3 educations
        const education_0 = await createEducation(authObjects.candidateOneAuthHeaders);
        const education_1 = await createEducation(authObjects.candidateOneAuthHeaders);
        const education_2 = await createEducation(authObjects.candidateOneAuthHeaders);

        // Re-order the educations
        const response = await request.post(`/api/v2/candidate/education/re-order`, {
            headers: authObjects.companyOneAuthHeaders,
            data: {
                "educations": [
                    education_2.data,
                    education_1.data,
                    education_0.data
                ]
            }
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });

    test("POST re-order educations with empty educations", async ({ request }) => {
        const response = await request.post(`/api/v2/candidate/education/re-order`, {
            headers: authObjects.candidateOneAuthHeaders,
            data: {
                "educations": []
            }
        });

        expect.soft(response.status()).toBe(422);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message.educations).toEqual(["The educations field is required."]);
    });

    test("POST re-order educations with empty data", async ({ request }) => {
        const response = await request.post(`/api/v2/candidate/education/re-order`, {
            headers: authObjects.candidateOneAuthHeaders,
            data: {}
        });

        expect.soft(response.status()).toBe(422);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message.educations).toEqual(["The educations field is required."]);
    });
});