// GET: /api/v2/job/screening-meta-data

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createQuestionSet, deleteAllQuestionSets, deleteQuestionSetById, getQuestionSetById, getQuizMetaData, QuestionSetType } from '@datafactory/question-group';
import { create } from 'domain';

test.describe("/api/v2/job/screening-meta-data GET requests @company", async () => {
    let question_set_id: any = null;
    let question_set: any = null;

    test.beforeAll(async () => {
        await deleteAllQuestionSets(authObjects.companyOneAuthHeaders);
        question_set_id = await createQuestionSet(authObjects.companyOneAuthHeaders, QuestionSetType.SCREENING);
        question_set = await getQuestionSetById(authObjects.companyOneAuthHeaders, question_set_id);
    });

    test.afterAll(async () => {
        await deleteQuestionSetById(authObjects.companyOneAuthHeaders, question_set_id);
    });

    // TODO: Fix this test later
    test.skip("GET with valid credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/job/screening-meta-data`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        // expect(body.message).toBe("Unauthenticated.");
        // expect.soft(body.question_set[0].id).toBe(9056);
        // expect.soft(body.question_set[0].name).toBe("Screening-2 from Admin");
        // expect.soft(body.question_set[0].note).toBeNull();
        // expect.soft(body.question_set[0].internal_note).toBeNull();
        // expect.soft(body.question_set[1].id).toBe(253);
        // expect.soft(body.question_set[1].name).toBe("Screening-1 from Admin");
        // expect.soft(body.question_set[1].note).toBeNull();
        // expect.soft(body.question_set[1].internal_note).toBeNull();
        expect.soft(body.question_types[0].id).toBe(1);
        expect.soft(body.question_types[0].name).toBe("Text");
        expect.soft(body.question_types[1].id).toBe(2);
        expect.soft(body.question_types[1].name).toBe("Multiple Choice");

        // console.log(question_set);
        expect.soft(body.question_set[2].id).toBe(question_set.id);
        expect.soft(body.question_set[2].name).toBe(question_set.set_name);
        expect.soft(body.question_set[2].note).toBe(question_set.note);
        expect.soft(body.question_set[2].internal_note).toBe(question_set.internal_note);
    });

    test("GET without credentials", async ({ request }) => {
        const response = await request.get(`/api/v2/job/screening-meta-data`, {
            headers: {
                "Accept": "application/json",
            }
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe("Unauthenticated.");
    });

    test("GET with invalid credentials @security", async ({ request }) => {
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        // maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.get(`/api/v2/job/screening-meta-data`, {
            headers: maliciousHeaders
        });

        expect.soft(response.status()).toBe(471);

        const body = await response.json();
        // await createAssertions(body);
        // expect(body.message).toBe("Unauthenticated.");
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("GET with candidates credentials", async ({ request }) => {
        const response = await request.get(`/api/v2/job/screening-meta-data`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });
});