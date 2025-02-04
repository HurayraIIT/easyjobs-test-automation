//POST: /api/v2/company/assessments/{assessment}/update

import { test, expect } from "@playwright/test";
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createQuestionSet, deleteAllQuestionSets, deleteQuestionSetById, getRandomQuestionSetData, QuestionSetType } from "@datafactory/question-group";
import { createAssessmentFromQuiz, deleteAllAssessments, getAssessmentById, getAssessmentCreationData } from "@datafactory/assessment";

test.describe("/api/v2/company/assessments/{assessment}/update POST requests @company", async () => {
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

    test("POST can update an existing assessment @happy", async ({ request }) => {
        // Create a new assessment
        const assessment_id = await createAssessmentFromQuiz(authObjects.companyOneAuthHeaders, quiz_id);
        expect(assessment_id).toBeGreaterThan(0);

        // Update the assessment
        const assessment_creation_data = await getAssessmentCreationData(authObjects.companyOneAuthHeaders, quiz_id);
        assessment_creation_data.id = assessment_id;

        const response = await request.post(`/api/v2/company/assessments/${assessment_id}/update`, {
            data: assessment_creation_data,
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Saved.");

        const updated_assessment = await getAssessmentById(authObjects.companyOneAuthHeaders, assessment_id);
        expect(updated_assessment.assessment_name).toBe(assessment_creation_data.assessment_name);
    });

    test("POST with empty data", async ({ request }) => {
        // Create a new assessment
        const assessment_id = await createAssessmentFromQuiz(authObjects.companyOneAuthHeaders, quiz_id);
        expect(assessment_id).toBeGreaterThan(0);

        const response = await request.post(`/api/v2/company/assessments/${assessment_id}/update`, {
            data: {},
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(422);

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
        // Create a new assessment
        const assessment_id = await createAssessmentFromQuiz(authObjects.companyOneAuthHeaders, quiz_id);
        expect(assessment_id).toBeGreaterThan(0);

        const response = await request.post(`/api/v2/company/assessments/${assessment_id}/update`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(422);

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
        // Create a new assessment
        const assessment_id = await createAssessmentFromQuiz(authObjects.companyOneAuthHeaders, quiz_id);
        expect(assessment_id).toBeGreaterThan(0);

        // Update the assessment
        const assessment_creation_data = await getAssessmentCreationData(authObjects.companyOneAuthHeaders, quiz_id);
        assessment_creation_data.id = assessment_id;

        const response = await request.post(`/api/v2/company/assessments/${assessment_id}/update`, {
            data: assessment_creation_data,
            headers: {
                "Accept": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.message).toBe('Unauthenticated.');
    });

    test("POST with valid data but with candidate auth", async ({ request }) => {
        // Create a new assessment
        const assessment_id = await createAssessmentFromQuiz(authObjects.companyOneAuthHeaders, quiz_id);
        expect(assessment_id).toBeGreaterThan(0);

        // Update the assessment
        const assessment_creation_data = await getAssessmentCreationData(authObjects.companyOneAuthHeaders, quiz_id);
        assessment_creation_data.id = assessment_id;

        const response = await request.post(`/api/v2/company/assessments/${assessment_id}/update`, {
            data: assessment_creation_data,
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
