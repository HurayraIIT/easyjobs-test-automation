// GET: /api/v2/candidate/employment

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createCandidateEmployment, deleteAllEmployments, deleteEmployment } from '@datafactory/employment';
import { createAssertions } from '@helpers/createAssertions';

test.describe("/api/v2/candidate/employment GET requests @candidate", async () => {
    test.beforeAll(async () => {
        await deleteAllEmployments(authObjects.candidateOneAuthHeaders);
    });

    test("GET with valid credentials @happy", async ({ request }) => {
        const employment = await createCandidateEmployment(authObjects.candidateOneAuthHeaders);

        const response = await request.get(`/api/v2/candidate/employment?id=${employment.data.id}`, {
            headers: authObjects.candidateOneAuthHeaders
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

    test("GET with another candidates credentials @security", async ({ request }) => {
        const employment = await createCandidateEmployment(authObjects.candidateOneAuthHeaders);

        const response = await request.get(`/api/v2/candidate/employment?id=${employment.data.id}`, {
            headers: authObjects.candidateTwoAuthHeaders
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("responses.employment.not_found");
    });

    test("GET with company credentials @security", async ({ request }) => {
        const employment = await createCandidateEmployment(authObjects.candidateOneAuthHeaders);

        const response = await request.get(`/api/v2/candidate/employment?id=${employment.data.id}`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(480);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });

    test("GET without auth token", async ({ request }) => {
        const employment = await createCandidateEmployment(authObjects.candidateOneAuthHeaders);

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
        const employment = await createCandidateEmployment(authObjects.candidateOneAuthHeaders);
        await deleteEmployment(authObjects.candidateOneAuthHeaders, employment.data.id);

        const response = await request.get(`/api/v2/candidate/employment?id=${employment.data.id}`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect(response.status()).toBe(400);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("responses.employment.not_found");
    });

    test("GET with empty id", async ({ request }) => {
        const response = await request.get(`/api/v2/candidate/employment?id=`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect(response.status()).toBe(400);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("responses.employment.not_found");
    });

    test("GET with string as id", async ({ request }) => {
        const response = await request.get(`/api/v2/candidate/employment?id=asd`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect(response.status()).toBe(400);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.data).toEqual([]);
        expect(body.message).toBe("responses.employment.not_found");
        expect(body.message).toBe("responses.employment.not_found");
    });
});