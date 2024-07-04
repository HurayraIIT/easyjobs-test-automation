// DELETE: /api/v2/company/assessments/{assessment}/delete

import { test, expect } from '@playwright/test';
import { createAuthHeaders } from '@datafactory/auth';
import { createAssertions } from '@helpers/createAssertions';
import { createQuestionSet, deleteAllQuestionSets, deleteQuestionSetById, QuestionSetType } from '@datafactory/question-group';
import { createAssessmentFromQuiz, deleteAllAssessments, deleteAssessmentById } from '@datafactory/assessment';

test.describe("/api/v2/company/assessments/{assessment}/delete DELETE requests @company", async () => {
    const companyEmail = `${process.env.COMPANY_EMAIL}`;
    const companyPassword = `${process.env.COMPANY_PASSWORD}`;

    const candidateEmail = `${process.env.CANDIDATE_EMAIL}`;
    const candidatePassword = `${process.env.CANDIDATE_PASSWORD}`;

    let companyAuthHeaders: any;
    let candidateAuthHeaders: any;

    let quiz: any;
    let new_assessment: any;

    test.beforeAll(async () => {
        companyAuthHeaders = await createAuthHeaders(companyEmail, companyPassword);
        candidateAuthHeaders = await createAuthHeaders(candidateEmail, candidatePassword);

        quiz = await createQuestionSet(companyAuthHeaders, QuestionSetType.QUIZ);
        new_assessment = await createAssessmentFromQuiz(companyAuthHeaders, quiz.id);
        expect(new_assessment.id).toBeGreaterThan(0);
    });

    test.afterAll(async () => {
        await deleteAllQuestionSets(companyAuthHeaders);
        await deleteAllAssessments(companyAuthHeaders);
    });

    test("DELETE with deleted assessment id and valid token", async ({ request }) => {
        await deleteAssessmentById(companyAuthHeaders, new_assessment.id);

        // Try to get the assessment again
        const response = await request.delete(`/api/v2/company/assessments/${new_assessment.id}/delete`, {
            headers: companyAuthHeaders
        });

        expect(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Unauthorized Access");
    });

    test("DELETE with valid assessment id and invalid token", async ({ request }) => {
        const response = await request.delete(`/api/v2/company/assessments/${new_assessment.id}/delete`, {
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
            headers: companyAuthHeaders
        });

        expect(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Unauthorized Access");
    });

    test("DELETE with valid assessment id and candidate token", async ({ request }) => {
        const response = await request.delete(`/api/v2/company/assessments/${new_assessment.id}/delete`, {
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