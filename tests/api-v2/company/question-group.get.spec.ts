// GET: /api/v2/company/question/group/{group}

import { test, expect } from '@playwright/test';
import { createAuthHeaders } from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createQuestionSet, deleteAllQuestionSets, deleteQuestionSetById, getQuestionSetById } from '@datafactory/question-group';

test.describe("/api/v2/company/question/group/{group} GET requests @company", async () => {
    const companyEmail = `${process.env.COMPANY_EMAIL}`;
    const companyPassword = `${process.env.COMPANY_PASSWORD}`;

    let authHeaders: any;

    test.beforeEach(async () => {
        authHeaders = await createAuthHeaders(companyEmail, companyPassword);
    });

    test("GET with valid credentials @happy", async ({ request }) => {
        const set = await createQuestionSet(authHeaders);
        const question_set = await getQuestionSetById(authHeaders, set.id);

        // await createAssertions(question_set);
        expect(question_set.id).toBe(set.id);
        expect(question_set.set_type.id).toBe(set.exam_type.id);
        expect(question_set.set_type.name).toBe(set.exam_type.name);
        expect(question_set.set_name).toBe(set.name);
        expect(question_set.exam_duration).toBeNull();
        expect(question_set.marks_per_question).toBeNull();

        // Delete the question set
        await deleteQuestionSetById(authHeaders, set.id);
    });

    test("GET without auth token", async ({ request }) => {
        const set = await createQuestionSet(authHeaders);
        const response = await request.get(`/api/v2/company/question/group/${set.id}`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');

        // Delete the question set
        await deleteQuestionSetById(authHeaders, set.id);
    });

    test("GET with invalid ID but valid auth token", async ({ request }) => {
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
});