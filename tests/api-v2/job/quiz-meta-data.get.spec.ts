// GET: /api/v2/job/quiz-meta-data

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createQuestionSet, getQuestionSetById, getQuizMetaData, QuestionSetType } from '@datafactory/question-group';

test.describe("/api/v2/job/quiz-meta-data GET requests @company", async () => {
    test("GET with valid credentials @happy", async ({ request }) => {
        // First create a question set
        let question_set_id = await createQuestionSet(authObjects.companyOneAuthHeaders, QuestionSetType.QUIZ);
        let question_set = await getQuestionSetById(authObjects.companyOneAuthHeaders, question_set_id);

        // Get the quiz meta data and verify that the response has the question_set
        const quiz_meta_data = await getQuizMetaData(authObjects.companyOneAuthHeaders);

        let flag = 0;
        for (let quiz of quiz_meta_data) {
            if (quiz.id === question_set.id) {
                flag = 1;
                expect(quiz.id).toBe(question_set.id);
                expect(quiz.name).toBe(question_set.set_name);
                expect(quiz.exam_type).toBe(question_set.set_type.id);
                expect(quiz.exam_duration).toBeNull();
                expect(quiz.marks_per_question).toBeNull();
                expect(quiz.created_by).toBeGreaterThan(0);
                expect(quiz.updated_by).toBeGreaterThan(0);
                expect(quiz.deleted_at).toBeNull();
                expect(quiz.created_at).toBeTruthy();
                expect(quiz.updated_at).toBeTruthy();
                expect(quiz.internal_note).toBe(question_set.internal_note);
            }
        }
        expect(flag).toBe(1);
    });

    test("GET without credentials", async ({ request }) => {
        const response = await request.get(`/api/v2/job/quiz-meta-data`, {
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

        const response = await request.get(`/api/v2/job/quiz-meta-data`, {
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
        const response = await request.get(`/api/v2/job/quiz-meta-data`, {
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