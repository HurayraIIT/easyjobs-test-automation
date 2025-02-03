// POST: /api/v2/candidate/education

import { test, expect } from "@playwright/test";
import authObjects from '@datafactory/auth';
import { getRandomEducationData } from "@datafactory/education";
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/candidate/education POST requests @candidate", async () => {
    test("POST can create a new education and edit it @happy", async ({ request }) => {
        // Create a new education
        let education_data = getRandomEducationData();
        const response = await request.post('/api/v2/candidate/education', {
            data: education_data,
            headers: authObjects.candidateOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        expect(body.status).toBe('SUCCESS');
        expect(body.message).toBe('Updated.');

        expect(body.data.user_id).toBeGreaterThan(0);
        expect(body.data.level).toBe(education_data.level);
        expect(body.data.degree).toBe(education_data.degree);
        expect(body.data.academy_name).toBe(education_data.academy_name);
        expect(body.data.passing_year).toBe(education_data.passing_year);
        expect(body.data.level_id).toBeGreaterThan(0);
        expect(body.data.degree_id).toBeGreaterThan(0);
        expect(body.data.order).toBeGreaterThan(0);
        expect(body.data.id).toBeGreaterThan(0);

        // Edit the education
        let new_education_data = getRandomEducationData();
        new_education_data.id = body.data.id;
        const new_response = await request.post('/api/v2/candidate/education', {
            data: new_education_data,
            headers: authObjects.candidateOneAuthHeaders
        });

        expect(new_response.status()).toBe(200);

        const new_body = await new_response.json();

        expect(new_body.status).toBe('SUCCESS');
        expect(new_body.message).toBe('Updated.');

        expect(new_body.data.user_id).toBe(body.data.user_id);
        expect(body.data.level).toBe(education_data.level);
        expect(body.data.degree).toBe(education_data.degree);
        expect(body.data.academy_name).toBe(education_data.academy_name);
        expect(body.data.passing_year).toBe(education_data.passing_year);
        expect(body.data.level_id).toBeGreaterThan(0);
        expect(body.data.degree_id).toBeGreaterThan(0);
        expect(body.data.order).toBeGreaterThan(0);
        expect(new_body.data.id).toBe(body.data.id);
    });

    test("POST with empty data", async ({ request }) => {
        const response = await request.post('/api/v2/candidate/education', {
            data: {},
            headers: authObjects.candidateOneAuthHeaders
        });

        expect(response.status()).toBe(422);

        const body = await response.json();

        //await createAssertions(body);
        expect(body.message).toBe("The academy name field is required. (and 3 more errors)");
        expect(body.errors.academy_name).toEqual(["The academy name field is required."]);
        expect(body.errors.level).toEqual(["The level field is required."]);
        expect(body.errors.passing_year).toEqual(["The passing year field is required."]);
        expect(body.errors.degree).toEqual(["The degree field is required."]);
    });

    test("POST with no data", async ({ request }) => {
        const response = await request.post('/api/v2/candidate/education', {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect(response.status()).toBe(422);

        const body = await response.json();

        //await createAssertions(body);
        expect(body.message).toBe("The academy name field is required. (and 3 more errors)");
        expect(body.errors.academy_name).toEqual(["The academy name field is required."]);
        expect(body.errors.level).toEqual(["The level field is required."]);
        expect(body.errors.passing_year).toEqual(["The passing year field is required."]);
        expect(body.errors.degree).toEqual(["The degree field is required."]);
    });

    test("POST with valid data but no auth", async ({ request }) => {
        const education_data = getRandomEducationData();

        const response = await request.post('/api/v2/candidate/education', {
            data: education_data,
            headers: {
                "Accept": "application/json"
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });
});
