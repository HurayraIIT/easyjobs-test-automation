//GET: /api/v2/company/assessments/{id}

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createQuestionSet, deleteAllQuestionSets, QuestionSetType } from '@datafactory/question-group';
import { createAssessmentFromQuiz, deleteAllAssessments, getAssessmentById } from '@datafactory/assessment';

test.describe("/api/v2/company/assessments/{id} GET requests @company", async () => {
    let quiz: any;

    test.beforeAll(async () => {
        quiz = await createQuestionSet(authObjects.companyOneAuthHeaders, QuestionSetType.QUIZ);
    });

    // test.afterAll(async () => {
    //     await deleteAllQuestionSets(authObjects.companyOneAuthHeaders);
    //     await deleteAllAssessments(authObjects.companyOneAuthHeaders);
    // });

    test("GET with valid credentials and valid id @happy", async () => {
        const new_assessment = await createAssessmentFromQuiz(authObjects.companyOneAuthHeaders, quiz.id);

        const response = await getAssessmentById(authObjects.companyOneAuthHeaders, new_assessment.id);

        expect(response.id).toBe(new_assessment.id);
        expect(response.assessment_name).toBe(new_assessment.name);
        expect(response.set_type).toEqual(new_assessment.exam_type);

        expect(new_assessment.total_questions).toBe(response.questions.length);
    });

    test("GET with invalid credentials but valid id", async ({ request }) => {
        const new_assessment = await createAssessmentFromQuiz(authObjects.companyOneAuthHeaders, quiz.id);

        const response = await request.get(`/api/v2/company/assessments/${new_assessment.id}`, {
            headers: {
                "Accept": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe("Unauthenticated.");
    });

    test("GET with candidates credentials but valid id", async ({ request }) => {
        const new_assessment = await createAssessmentFromQuiz(authObjects.companyOneAuthHeaders, quiz.id);

        const response = await request.get(`/api/v2/company/assessments/${new_assessment.id}`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect(response.status()).toBe(480);

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

        expect(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Unauthorized Access");
    });
});