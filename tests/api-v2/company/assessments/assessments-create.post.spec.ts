//POST /api/v2/company/assessments/create

import { test, expect } from "@playwright/test";
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createQuestionSet, deleteAllQuestionSets, deleteQuestionSetById, getRandomQuestionSetData, QuestionSetType } from "@datafactory/question-group";
import { createAssessmentFromQuiz, deleteAllAssessments, getAssessmentById, getAssessmentCreationData } from "@datafactory/assessment";

test.describe("/api/v2/company/assessments/create POST requests @company", async () => {
    let quiz_id: any;

    test.beforeEach(async () => {
        quiz_id = await createQuestionSet(authObjects.companyOneAuthHeaders, QuestionSetType.QUIZ);
    });

    test.afterAll(async () => {
        await deleteAllQuestionSets(authObjects.companyOneAuthHeaders);
        await deleteAllAssessments(authObjects.companyOneAuthHeaders);
    });

    test("POST can create a new assessment @happy", async ({ request }) => {
        // Create a new assessment
        const assessment_id = await createAssessmentFromQuiz(authObjects.companyOneAuthHeaders, quiz_id);
        const response = await getAssessmentById(authObjects.companyOneAuthHeaders, assessment_id);

        expect(response.id).toBe(assessment_id);
    });

    test("POST with empty data", async ({ request }) => {
        const response = await request.post('/api/v2/company/assessments/create', {
            headers: authObjects.companyOneAuthHeaders,
            data: {}
        });

        expect.soft(response.status()).toBe(422);
        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message.assessment_name).toEqual(["Please provide a valid assessment name."]);
        expect(body.message.set_type).toEqual(["The field is required."]);
        expect(body.message.exam_duration).toEqual(["The field is required."]);
        expect(body.message.marks_per_question).toEqual(["The field is required."]);
        expect(body.message.questions).toEqual(["The field is required."]);
    });

    test("POST with no data", async ({ request }) => {
        const response = await request.post('/api/v2/company/assessments/create', {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(422);
        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message.assessment_name).toEqual(["Please provide a valid assessment name."]);
        expect(body.message.set_type).toEqual(["The field is required."]);
        expect(body.message.exam_duration).toEqual(["The field is required."]);
        expect(body.message.marks_per_question).toEqual(["The field is required."]);
        expect(body.message.questions).toEqual(["The field is required."]);
    });

    test("POST with valid data but no auth", async ({ request }) => {
        const assessment_creation_data = await getAssessmentCreationData(authObjects.companyOneAuthHeaders, quiz_id);
        const response = await request.post('/api/v2/company/assessments/create', {
            headers: {
                "Accept": "application/json",
            },
            data: assessment_creation_data
        });

        expect.soft(response.status()).toBe(401);
        const body = await response.json();

        // await createAssertions(body);
        expect(body.message).toBe('Unauthenticated.');
    });

    test("POST with valid data but candidates auth", async ({ request }) => {
        const assessment_creation_data = await getAssessmentCreationData(authObjects.companyOneAuthHeaders, quiz_id);
        const response = await request.post('/api/v2/company/assessments/create', {
            headers: authObjects.candidateOneAuthHeaders,
            data: assessment_creation_data
        });

        expect.soft(response.status()).toBe(480);
        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });
});
