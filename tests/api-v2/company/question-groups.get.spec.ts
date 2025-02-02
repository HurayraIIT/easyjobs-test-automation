// GET: /api/v2/company/question/groups

import { test, expect } from '@playwright/test';
import { createAuthHeaders } from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createQuestionSet, deleteAllQuestionSets, deleteQuestionSetById, getAllQuestionSets, getQuestionSetById } from '@datafactory/question-group';

test.describe("/api/v2/company/question/groups GET requests @company", async () => {
    const companyEmail = `${process.env.COMPANY_EMAIL}`;
    const companyPassword = `${process.env.COMPANY_PASSWORD}`;

    const candidateEmail = `${process.env.CANDIDATE_EMAIL}`;
    const candidatePassword = `${process.env.CANDIDATE_PASSWORD}`;

    let companyAuthHeaders: any;
    let candidateAuthHeaders: any;

    test.beforeAll(async () => {
        companyAuthHeaders = await createAuthHeaders(companyEmail, companyPassword);
        candidateAuthHeaders = await createAuthHeaders(candidateEmail, candidatePassword);
    });

    test.afterAll(async () => {
        await deleteAllQuestionSets(companyAuthHeaders);
    });

    test("GET with valid credentials @happy", async ({ request }) => {
        const set = await createQuestionSet(companyAuthHeaders);

        expect(set.id).toBeGreaterThan(0);
    });

    test("GET without auth token", async ({ request }) => {
        const response = await request.get(`/api/v2/company/question/groups`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });

    test("GET with candidates auth token", async ({ request }) => {
        const response = await request.get(`/api/v2/company/question/groups`, {
            headers: candidateAuthHeaders
        });

        expect(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });
});