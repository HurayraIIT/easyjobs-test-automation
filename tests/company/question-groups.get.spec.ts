// GET: /api/v2/company/question/groups

import { test, expect } from '@playwright/test';
import { createAuthHeaders } from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createQuestionSet, deleteAllQuestionSets, deleteQuestionSetById, getAllQuestionSets, getQuestionSetById } from '@datafactory/question-group';

test.describe("/api/v2/company/question/groups GET requests @company", async () => {
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

    test("GET with valid credentials @happy", async ({ request }) => {
        const set = await createQuestionSet(authHeaders);

        expect(set.id).toBeGreaterThan(0);
    });

    test("GET without auth token", async ({ request }) => {
        const set = await createQuestionSet(authHeaders);
        const response = await request.get(`/api/v2/company/question/groups`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });
});