// DELETE: /api/v2/company/assessments/{assessment}/delete

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from '@helpers/createAssertions';
import { createQuestionSet, deleteAllQuestionSets, deleteQuestionSetById, QuestionSetType } from '@datafactory/question-group';
import { createAssessmentFromQuiz, deleteAllAssessments, deleteAssessmentById } from '@datafactory/assessment';

test.describe("/api/v2/company/assessments/{assessment}/delete DELETE requests @company", async () => {
    let quiz_id: any;
    let new_assessment_id: any;

    test.beforeAll(async () => {
        quiz_id = await createQuestionSet(authObjects.companyOneAuthHeaders, QuestionSetType.QUIZ);
        new_assessment_id = await createAssessmentFromQuiz(authObjects.companyOneAuthHeaders, quiz_id);
        expect(new_assessment_id).toBeGreaterThan(0);
    });

    // test.afterAll(async () => {
    //     await deleteAllQuestionSets(authObjects.companyOneAuthHeaders);
    //     await deleteAllAssessments(authObjects.companyOneAuthHeaders);
    // });

    test("DELETE with deleted assessment id and valid token", async ({ request }) => {
        await deleteAssessmentById(authObjects.companyOneAuthHeaders, new_assessment_id);

        // Try to get the assessment again
        const response = await request.delete(`/api/v2/company/assessments/${new_assessment_id}/delete`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Unauthorized Access");
    });

    test("DELETE with valid assessment id and invalid token", async ({ request }) => {
        const response = await request.delete(`/api/v2/company/assessments/${new_assessment_id}/delete`, {
            headers: {
                "Accept": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.message).toBe("Unauthenticated.");
    });

    test("DELETE with invalid int assessment id and valid token", async ({ request }) => {
        const response = await request.delete(`/api/v2/company/assessments/123/delete`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Unauthorized Access");
    });

    test("DELETE with valid assessment id and candidate token", async ({ request }) => {
        const response = await request.delete(`/api/v2/company/assessments/${new_assessment_id}/delete`, {
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