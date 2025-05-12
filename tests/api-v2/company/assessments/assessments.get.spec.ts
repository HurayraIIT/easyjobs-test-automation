// GET: /api/v2/company/assessments

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createQuestionSet, deleteAllQuestionSets, QuestionSetType } from '@datafactory/question-group';
import { createAssessmentFromQuiz, deleteAllAssessments, getAllAssessments } from '@datafactory/assessment';

test.describe("/api/v2/company/assessments GET requests @company", async () => {
    let quiz1_id: any;
    let quiz2_id: any;

    let assessment1_id: any;
    let assessment2_id: any;

    test.beforeAll(async () => {
        quiz1_id = await createQuestionSet(authObjects.companyOneAuthHeaders, QuestionSetType.QUIZ);
        quiz2_id = await createQuestionSet(authObjects.companyOneAuthHeaders, QuestionSetType.QUIZ);

        assessment1_id = await createAssessmentFromQuiz(authObjects.companyOneAuthHeaders, quiz1_id);
        assessment2_id = await createAssessmentFromQuiz(authObjects.companyOneAuthHeaders, quiz2_id);
    });

    test.afterAll(async () => {
        await deleteAllQuestionSets(authObjects.companyOneAuthHeaders);
        await deleteAllAssessments(authObjects.companyOneAuthHeaders);
    });

    test("GET with valid credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/company/assessments`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const data = await response.json();
        const all_assessments = data.data;
        let flag = 0;
        for (const assessment of all_assessments) {
            if (assessment.id === assessment1_id) {
                flag += 1;
            }

            if (assessment.id === assessment2_id) {
                flag += 1;
            }
        }

        expect(flag).toBe(2);
    });

    test("GET without auth token", async ({ request }) => {
        const response = await request.get(`/api/v2/company/assessments`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });

    test("GET with candidates auth token", async ({ request }) => {
        const response = await request.get(`/api/v2/company/assessments`, {
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