// GET: /api/v2/candidate/education

import { test, expect } from '@playwright/test';
import { createAuthHeaders } from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createEducation, deleteAllEducations, deleteEducationById } from '@datafactory/education';

test.describe("/api/v2/candidate/education GET requests @candidate", async () => {
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

    test("GET with valid credentials @happy", async ({ request }) => {
        const education = await createEducation(authHeaders);

        const response = await request.get(`/api/v2/candidate/education?id=${education.data.id}`, {
            headers: authHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.id).toBe(education.data.id);
        expect(body.data.level).toBe(education.data.level);
        expect(body.data.degree).toBe(education.data.degree);
        expect(body.data.passing_year).toBe(Number(education.data.passing_year));
        expect(body.data.academy_name).toBe(education.data.academy_name);
        expect(body.message).toBeNull();
    });

    test("GET without auth token", async ({ request }) => {
        const education = await createEducation(authHeaders);

        const response = await request.get(`/api/v2/candidate/education?id=${education.data.id}`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });

    test("GET after deleting", async ({ request }) => {
        const education = await createEducation(authHeaders);
        await deleteEducationById(authHeaders, education.data.id);

        const response = await request.get(`/api/v2/candidate/education?id=${education.data.id}`, {
            headers: authHeaders
        });

        expect(response.status()).toBe(400);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Education history not found.");
    });

    test("GET with empty id", async ({ request }) => {
        const response = await request.get(`/api/v2/candidate/education?id=`, {
            headers: authHeaders
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Education history not found.");
        expect(body.message).toBe("Education history not found.");
    });

    test("GET with string as id", async ({ request }) => {
        const response = await request.get(`/api/v2/candidate/education?id=asd`, {
            headers: authHeaders
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Education history not found.");
    });
});