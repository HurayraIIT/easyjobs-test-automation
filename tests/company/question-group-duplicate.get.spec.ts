//GET /api/v2/company/question/group/{group}/duplicate

import { test, expect } from '@playwright/test';
import { createAuthHeaders } from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createQuestionSet, deleteAllQuestionSets, deleteQuestionSetById, duplicateQuestionSet, getQuestionSetById } from '@datafactory/question-group';

test.describe("/api/v2/company/question/group/{group}/duplicate GET requests @company", async () => {
    const companyEmail = `${process.env.COMPANY_EMAIL}`;
    const companyPassword = `${process.env.COMPANY_PASSWORD}`;

    let authHeaders: any;

    test.beforeEach(async () => {
        authHeaders = await createAuthHeaders(companyEmail, companyPassword);
    });

    test.afterAll(async () => {
        authHeaders = await createAuthHeaders(companyEmail, companyPassword);
        await deleteAllQuestionSets(authHeaders);
    });

    test("GET duplicate with valid credentials @happy", async ({ request }) => {
        const set = await createQuestionSet(authHeaders);
        const question_set = await duplicateQuestionSet(authHeaders, set.id);

        expect(question_set.id).toBeGreaterThan(set.id);
    });

    test("GET duplicate without auth token", async ({ request }) => {
        const set = await createQuestionSet(authHeaders);
        const response = await request.get(`/api/v2/company/question/group/${set.id}/duplicate`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });

    test("GET duplicate with invalid ID but valid auth token", async ({ request }) => {
        const response = await request.get(`/api/v2/company/question/group/123/duplicate`, {
            headers: authHeaders
        });

        expect(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have sufficient permissions.");
    });
});