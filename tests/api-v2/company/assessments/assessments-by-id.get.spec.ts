//GET: /api/v2/company/assessments/{id}

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createQuestionSet, deleteAllQuestionSets, getQuestionSetById, QuestionSetType } from '@datafactory/question-group';
import { createAssessmentFromQuiz, deleteAllAssessments, getAssessmentById } from '@datafactory/assessment';

test.describe("/api/v2/company/assessments/{id} GET requests @company", async () => {
    let quiz_id: any;

    test.beforeAll(async () => {
        quiz_id = await createQuestionSet(authObjects.companyOneAuthHeaders, QuestionSetType.QUIZ);
    });

    // test.afterAll(async () => {
    //     await deleteAllQuestionSets(authObjects.companyOneAuthHeaders);
    //     await deleteAllAssessments(authObjects.companyOneAuthHeaders);
    // });

    test("GET with valid credentials and valid id @happy", async ({ request }) => {
        const new_assessment_id = await createAssessmentFromQuiz(authObjects.companyOneAuthHeaders, quiz_id);

        const response = await request.get(`/api/v2/company/assessments/${new_assessment_id}`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const data = await response.json();
        expect(data.status).toBe('SUCCESS');
        expect(data.message).toBeNull();
        expect(data.data.id).toBe(new_assessment_id);
    });

    test("GET with invalid credentials but valid id", async ({ request }) => {
        const new_assessment = await createAssessmentFromQuiz(authObjects.companyOneAuthHeaders, quiz_id);

        const response = await request.get(`/api/v2/company/assessments/${new_assessment.id}`, {
            headers: {
                "Accept": "application/json",
            }
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe("Unauthenticated.");
    });

    test("GET with candidates credentials but valid id", async ({ request }) => {
        const new_assessment = await createAssessmentFromQuiz(authObjects.companyOneAuthHeaders, quiz_id);

        const response = await request.get(`/api/v2/company/assessments/${new_assessment.id}`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });

    test("GET with valid credentials but invalid id", async ({ request }) => {
        const response = await request.get(`/api/v2/company/assessments/123`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Unauthorized Access");
    });
});