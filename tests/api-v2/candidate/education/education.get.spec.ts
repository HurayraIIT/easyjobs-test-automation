// GET: /api/v2/candidate/education

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createEducation, deleteAllEducations, deleteEducationById } from '@datafactory/education';

test.describe("/api/v2/candidate/education GET requests @candidate", async () => {
    // test.beforeAll(async () => {
    //     await deleteAllEducations(authObjects.candidateOneAuthHeaders);
    // });

    test("GET with valid credentials @happy", async ({ request }) => {
        const education = await createEducation(authObjects.candidateOneAuthHeaders);

        const response = await request.get(`/api/v2/candidate/education?id=${education.data.id}`, {
            headers: authObjects.candidateOneAuthHeaders
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

    test("GET with valid credentials from another candidate @security", async ({ request }) => {
        const education = await createEducation(authObjects.candidateOneAuthHeaders);
        const response = await request.get(`/api/v2/candidate/education?id=${education.data.id}`, {
            headers: authObjects.candidateTwoAuthHeaders
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Education history not found.");
    });

    test("GET with valid credentials from a company @security", async ({ request }) => {
        const education = await createEducation(authObjects.candidateOneAuthHeaders);
        const response = await request.get(`/api/v2/candidate/education?id=${education.data.id}`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(480);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });

    test("GET without auth token @security", async ({ request }) => {
        const education = await createEducation(authObjects.candidateOneAuthHeaders);
        const response = await request.get(`/api/v2/candidate/education?id=${education.data.id}`, {
            headers: {
                "ACCEPT": "application/json",
                "Company-Id": "2227"
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });

    test("GET after deleting", async ({ request }) => {
        const education = await createEducation(authObjects.candidateOneAuthHeaders);
        await deleteEducationById(authObjects.candidateOneAuthHeaders, education.data.id);

        const response = await request.get(`/api/v2/candidate/education?id=${education.data.id}`, {
            headers: authObjects.candidateOneAuthHeaders
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
            headers: authObjects.candidateOneAuthHeaders
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Education history not found.");
    });

    test("GET with string as id", async ({ request }) => {
        const response = await request.get(`/api/v2/candidate/education?id=asd`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect(response.status()).toBe(400);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Education history not found.");
    });
});