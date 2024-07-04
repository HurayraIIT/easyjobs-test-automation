//POST: /api/v2/company/assessments/{assessment}/update

import { test, expect } from "@playwright/test";
import { createAuthHeaders } from "@datafactory/auth";
import { createAssertions } from "@helpers/createAssertions";
import { createQuestionSet, deleteAllQuestionSets, deleteQuestionSetById, getRandomQuestionSetData, QuestionSetType } from "@datafactory/question-group";
import { createAssessmentFromQuiz, deleteAllAssessments, getAssessmentById, getAssessmentCreationData } from "@datafactory/assessment";

test.describe("/api/v2/company/assessments/{assessment}/update POST requests @company", async () => {
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

    test("POST can update an existing assessment @happy", async ({ request }) => {
        // Create a new assessment
        const assessment = await createAssessmentFromQuiz(companyAuthHeaders, quiz.id);
        expect(assessment.id).toBeGreaterThan(0);

        // Update the assessment
        const assessment_creation_data = await getAssessmentCreationData(companyAuthHeaders, quiz.id);
        assessment_creation_data.id = assessment.id;

        const response = await request.post(`/api/v2/company/assessments/${assessment.id}/update`, {
            data: assessment_creation_data,
            headers: companyAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Saved.");

        const updated_assessment = await getAssessmentById(companyAuthHeaders, assessment.id);
        expect(updated_assessment.assessment_name).toBe(assessment_creation_data.assessment_name);
        expect(updated_assessment.assessment_name).not.toBe(assessment.assessment_name);
    });

    test("POST with empty data", async ({ request }) => {
        // Create a new assessment
        const assessment = await createAssessmentFromQuiz(companyAuthHeaders, quiz.id);
        expect(assessment.id).toBeGreaterThan(0);

        const response = await request.post(`/api/v2/company/assessments/${assessment.id}/update`, {
            data: {},
            headers: companyAuthHeaders
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
        const assessment = await createAssessmentFromQuiz(companyAuthHeaders, quiz.id);
        expect(assessment.id).toBeGreaterThan(0);

        const response = await request.post(`/api/v2/company/assessments/${assessment.id}/update`, {
            headers: companyAuthHeaders
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
        const assessment = await createAssessmentFromQuiz(companyAuthHeaders, quiz.id);
        expect(assessment.id).toBeGreaterThan(0);

        // Update the assessment
        const assessment_creation_data = await getAssessmentCreationData(companyAuthHeaders, quiz.id);
        assessment_creation_data.id = assessment.id;

        const response = await request.post(`/api/v2/company/assessments/${assessment.id}/update`, {
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
        const assessment = await createAssessmentFromQuiz(companyAuthHeaders, quiz.id);
        expect(assessment.id).toBeGreaterThan(0);

        // Update the assessment
        const assessment_creation_data = await getAssessmentCreationData(companyAuthHeaders, quiz.id);
        assessment_creation_data.id = assessment.id;

        const response = await request.post(`/api/v2/company/assessments/${assessment.id}/update`, {
            data: assessment_creation_data,
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
