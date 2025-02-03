// GET: /api/v2/company/assessments

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createQuestionSet, deleteAllQuestionSets, QuestionSetType } from '@datafactory/question-group';
import { createAssessmentFromQuiz, deleteAllAssessments, getAllAssessments } from '@datafactory/assessment';

test.describe("/api/v2/company/assessments GET requests @company", async () => {
    let quiz1: any;
    let quiz2: any;

    let assessment1: any;
    let assessment2: any;

    test.beforeAll(async () => {
        quiz1 = await createQuestionSet(authObjects.companyOneAuthHeaders, QuestionSetType.QUIZ);
        quiz2 = await createQuestionSet(authObjects.companyOneAuthHeaders, QuestionSetType.QUIZ);

        assessment1 = await createAssessmentFromQuiz(authObjects.companyOneAuthHeaders, quiz1.id);
        assessment2 = await createAssessmentFromQuiz(authObjects.companyOneAuthHeaders, quiz2.id);
    });

    test.afterAll(async () => {
        await deleteAllQuestionSets(authObjects.companyOneAuthHeaders);
        await deleteAllAssessments(authObjects.companyOneAuthHeaders);
    });

    test("GET with valid credentials @happy", async ({ request }) => {
        let all_assessments = await getAllAssessments(authObjects.companyOneAuthHeaders);

        let flag = 0;
        for (const assessment of all_assessments) {
            if (assessment.id === assessment1.id) {
                flag += 1;
                expect(assessment.id).toBe(assessment1.id);
                expect(assessment.name).toBe(assessment1.name);
                expect(assessment.company_id).toBe(assessment1.company_id);
                expect(assessment.exam_type).toEqual(assessment1.exam_type);
                expect(assessment.total_questions).toBe(assessment1.total_questions);
                expect(assessment.last_update).toBe(assessment1.last_update);

            }

            if (assessment.id === assessment2.id) {
                flag += 1;
                expect(assessment.id).toBe(assessment2.id);
                expect(assessment.name).toBe(assessment2.name);
                expect(assessment.company_id).toBe(assessment2.company_id);
                expect(assessment.exam_type).toEqual(assessment2.exam_type);
                expect(assessment.total_questions).toBe(assessment2.total_questions);
                expect(assessment.last_update).toBe(assessment2.last_update);
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

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });

    test("GET with candidates auth token", async ({ request }) => {
        const response = await request.get(`/api/v2/company/assessments`, {
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