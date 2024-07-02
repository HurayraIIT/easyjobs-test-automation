// DELETE: /api/v2/company/question/group/{group}

import { test, expect } from '@playwright/test';
import { createAuthHeaders } from '@datafactory/auth';
import { createAssertions } from '@helpers/createAssertions';
import { createQuestionSet, deleteAllQuestionSets, deleteQuestionSetById } from '@datafactory/question-group';

test.describe("/api/v2/company/question/group/{group} DELETE requests @company", async () => {
    const companyEmail = `${process.env.COMPANY_EMAIL}`;
    const companyPassword = `${process.env.COMPANY_PASSWORD}`;

    let authHeaders: any;

    test.beforeEach(async () => {
        authHeaders = await createAuthHeaders(companyEmail, companyPassword);
    });

    test("DELETE with valid set id and valid token @happy", async ({ request }) => {
        // Create a new question set
        const new_question_set = await createQuestionSet(authHeaders);

        // Delete the question set
        await deleteQuestionSetById(authHeaders, new_question_set.id);

        // Try to get the question set again
        const response = await request.get(`/api/v2/company/question/group/${new_question_set.id}`, {
            headers: authHeaders
        });

        expect(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have sufficient permissions.");
    });

    test("DELETE with valid set id and invalid token", async ({ request }) => {
        // Create a new question set
        const new_question_set = await createQuestionSet(authHeaders);

        // Try to get the question set again
        const response = await request.get(`/api/v2/company/question/group/${new_question_set.id}`, {
            headers: {
                "Accept": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.message).toBe("Unauthenticated.");

        // Delete the question set
        await deleteQuestionSetById(authHeaders, new_question_set.id);
    });

    test("DELETE with invalid int set id and valid token", async ({ request }) => {
        const response = await request.get(`/api/v2/company/question/group/123`, {
            headers: authHeaders
        });

        expect(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have sufficient permissions.");
    });

    test("DELETE with invalid string set id and valid token", async ({ request }) => {
        const response = await request.get(`/api/v2/company/question/group/abcdef`, {
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