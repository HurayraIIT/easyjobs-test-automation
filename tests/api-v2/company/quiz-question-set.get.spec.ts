//GET: /api/v2/quiz-question-set/{id}

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createQuestionSet, deleteAllQuestionSets, getQuestionSetById, getQuizQuestionSetQuestions } from '@datafactory/question-group';

test.describe("/api/v2/quiz-question-set/{id} GET requests @company", async () => {
    let question_set: any;

    test.beforeAll(async () => {
        question_set = await createQuestionSet(authObjects.companyOneAuthHeaders);
        question_set = await getQuestionSetById(authObjects.companyOneAuthHeaders, question_set.id);
    });

    test.afterAll(async () => {
        await deleteAllQuestionSets(authObjects.companyOneAuthHeaders);
    });

    test("GET with valid credentials @happy", async () => {
        // get the original questions
        let original_questions = question_set.questions;

        // Get the questions via the api
        let response_questions = await getQuizQuestionSetQuestions(authObjects.companyOneAuthHeaders, question_set.id);
        response_questions = response_questions.questions;

        expect(response_questions.length).toBe(original_questions.length);

        for (let i = 0; i < response_questions.length; i++) {
            expect(response_questions[i].id).toBe(original_questions[i].id);
            expect(response_questions[i].type.id).toBe(original_questions[i].type.id);
            expect(response_questions[i].type.name).toBe(original_questions[i].type.name);
            expect(response_questions[i].title).toBe(original_questions[i].title);
            // expect(response_questions[i].answers).toEqual(original_questions[i].answers);
            expect(response_questions[i].isValid).toBe(original_questions[i].isValid);
            expect(response_questions[i].errors).toEqual(original_questions[i].errors);
            expect(response_questions[i].isMultiple).toBe(original_questions[i].isMultiple);

            expect(response_questions[i].options.length).toBe(original_questions[i].options.length);

            for (let j = 0; j < response_questions[i].options.length; j++) {
                expect(response_questions[i].options[j].id).toBe(original_questions[i].options[j].id);
                expect(response_questions[i].options[j].title).toBe(original_questions[i].options[j].title);
            }
        }
    });

    test("GET with invalid credentials but valid id", async ({ request }) => {
        const response = await request.get(`/api/v2/quiz-question-set/${question_set.id}`, {
            headers: {
                "Accept": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe("Unauthenticated.");
    });

    test("GET with valid credentials but invalid id", async ({ request }) => {
        const response = await request.get(`/api/v2/quiz-question-set/123`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.questions).toEqual([]);
    });

    test("GET with candidate auth with valid id", async ({ request }) => {
        const response = await request.get(`/api/v2/quiz-question-set/${question_set.id}`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });
});