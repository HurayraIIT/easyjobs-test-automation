// POST: /api/v2/candidate/education/re-order

import { test, expect } from '@playwright/test';
import { createAuthHeaders } from '@datafactory/auth';
import { createAssertions } from '@helpers/createAssertions';
import { createEducation, deleteAllEducations, getAllEducations } from '@datafactory/education';

test.describe("/api/v2/candidate/education/re-order POST requests @candidate", async () => {
    const candidateEmail = `${process.env.CANDIDATE_EMAIL}`;
    const candidatePassword = `${process.env.CANDIDATE_PASSWORD}`;
    let authHeaders: any;

    test.beforeAll(async () => {
        authHeaders = await createAuthHeaders(candidateEmail, candidatePassword);
        await deleteAllEducations(authHeaders);
    });

    test.beforeEach(async () => {
        authHeaders = await createAuthHeaders(candidateEmail, candidatePassword);
    });

    test("POST re-order educations with valid token @happy", async ({ request }) => {
        // Create 3 educations
        const education_0 = await createEducation(authHeaders);
        const education_1 = await createEducation(authHeaders);
        const education_2 = await createEducation(authHeaders);

        // Verify that the order is 0, 1, 2
        const all_educations = await getAllEducations(authHeaders);

        expect(all_educations.data[0].id).toBe(education_0.data.id);
        expect(all_educations.data[1].id).toBe(education_1.data.id);
        expect(all_educations.data[2].id).toBe(education_2.data.id);

        // Re-order the educations
        const response = await request.post(`/api/v2/candidate/education/re-order`, {
            headers: authHeaders,
            data: {
                "educations": [
                    education_2.data,
                    education_1.data,
                    education_0.data
                ]
            }
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.status).toBe('SUCCESS');
        expect(body.message).toBe('Sorted.');

        // Verify that the order is 2, 1, 0
        const sorted_educations = await getAllEducations(authHeaders);

        expect(sorted_educations.data[0].id).toBe(education_2.data.id);
        expect(sorted_educations.data[1].id).toBe(education_1.data.id);
        expect(sorted_educations.data[2].id).toBe(education_0.data.id);
    });

    test("POST re-order educations with invalid token", async ({ request }) => {
        // Create 3 educations
        const education_0 = await createEducation(authHeaders);
        const education_1 = await createEducation(authHeaders);
        const education_2 = await createEducation(authHeaders);

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

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });

    test("POST re-order educations with empty educations", async ({ request }) => {
        const response = await request.post(`/api/v2/candidate/education/re-order`, {
            headers: authHeaders,
            data: {
                "educations": []
            }
        });

        expect(response.status()).toBe(422);

        const body = await response.json();
        
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message.educations).toEqual(["The educations field is required."]);
    });

    test("POST re-order educations with empty data", async ({ request }) => {
        const response = await request.post(`/api/v2/candidate/education/re-order`, {
            headers: authHeaders,
            data: {}
        });

        expect(response.status()).toBe(422);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message.educations).toEqual(["The educations field is required."]);
    });
});