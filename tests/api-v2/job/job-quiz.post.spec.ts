// POST: /api/v2/job/{job}/quiz

import { test, expect } from "@playwright/test";
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { getDataForJobCreate, createJob, deleteAllDraftJobs } from "@datafactory/job";
import { createQuestionSet, deleteAllQuestionSets, getQuestionSetById, QuestionSetType } from "@datafactory/question-group";

test.describe("/api/v2/job/{job}/quiz POST requests @company", async () => {
    let first_job = null;
    let new_question_set_id = null;
    let questions = null;
    let quiz_data = null;

    test.beforeAll(async () => {
        first_job = await createJob(authObjects.companyOneAuthHeaders);
        new_question_set_id = await createQuestionSet(authObjects.companyOneAuthHeaders, QuestionSetType.QUIZ);
        questions = await getQuestionSetById(authObjects.companyOneAuthHeaders, new_question_set_id);
        quiz_data = {
            "job_id": first_job.id,
            "note": questions.note,
            "internal_note": questions.internal_note,
            "exam_duration": "31",
            "marks_per_question": "11",
            "questions": questions.questions,
        };
    });

    test.afterAll(async () => {
        await deleteAllDraftJobs(authObjects.companyOneAuthHeaders);
        await deleteAllQuestionSets(authObjects.companyOneAuthHeaders);
    });

    test("POST should be able to attach quiz questions to a job @happy", async ({ request }) => {
        // console.log(quiz_data);
        const response = await request.post(`/api/v2/job/${first_job.slug}/quiz`, {
            headers: authObjects.companyOneAuthHeaders,
            data: quiz_data
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // console.log(body);
        // await createAssertions(body.data);
        expect(body.status).toBe("SUCCESS");
        expect(body.message).toBe("Job updated.");
        expect(body.data.id).toBe(first_job.id);
        expect(body.data.quiz_id).toBeGreaterThan(1000);

        // Verify that the new quiz created by the job is accessible by the company
        const response2 = await request.get(`/api/v2/company/assessments/${body.data.quiz_id}`, {
            headers: authObjects.companyOneAuthHeaders
        });
        expect.soft(response.status()).toBe(200);
        const body2 = await response2.json();
        // console.log(body2);
        expect(body2.status).toBe("SUCCESS");
        expect(body2.message).toBe(null);
        expect(body2.data.id).toBe(body.data.quiz_id);
        expect(body2.data.assessment_name).toBe("auto-naming-quiz");
        expect(body2.data.exam_duration).toBe(parseInt(quiz_data.exam_duration));
        expect(body2.data.marks_per_question).toBe(parseInt(quiz_data.marks_per_question));
        expect(body2.data.note).toBe(quiz_data.note);
        expect(body2.data.internal_note).toBe(quiz_data.internal_note);

        // Verify that the new quiz created by the job is not accessible by another company
        const response3 = await request.get(`/api/v2/company/assessments/${body.data.quiz_id}`, {
            headers: authObjects.companyTwoAuthHeaders
        });
        expect.soft(response.status()).toBe(200);
        const body3 = await response3.json();
        // await createAssertions(body3);
        expect(body3.status).toBe("FAILED");
        expect(body3.data).toEqual([]);
        expect(body3.message).toBe("Unauthorized Access");
    });

    test("POST should not be able to attach quiz questions to a job by another company @security", async ({ request }) => {
        // console.log(quiz_data);
        const response = await request.post(`/api/v2/job/${first_job.slug}/quiz`, {
            headers: authObjects.companyTwoAuthHeaders,
            data: quiz_data
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();
        // console.log(body);
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Unauthorized Access");
    });

    test("POST should not be able to attach quiz questions to a job by a candidate @security", async ({ request }) => {
        // console.log(quiz_data);
        const response = await request.post(`/api/v2/job/${first_job.slug}/quiz`, {
            headers: authObjects.candidateOneAuthHeaders,
            data: quiz_data
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();
        // console.log(body);
        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });

    test("POST attach quiz questions empty data", async ({ request }) => {
        // console.log(quiz_data);
        const response = await request.post(`/api/v2/job/${first_job.slug}/quiz`, {
            headers: authObjects.companyOneAuthHeaders,
            data: {}
        });

        expect.soft(response.status()).toBe(422);

        const body = await response.json();
        // console.log(body);
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message.job_id).toEqual(["The field is required."]);
        expect(body.message.questions).toEqual(["The field is required."]);
    });

    test("POST attach quiz questions without auth", async ({ request }) => {
        // console.log(quiz_data);
        const response = await request.post(`/api/v2/job/${first_job.slug}/quiz`, {
            headers: {
                "Accept": "application/json",
            },
            data: quiz_data
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        // console.log(body);
        // await createAssertions(body);
        expect(body.message).toBe("Unauthenticated.");
    });

    test("POST attach quiz questions with invalid auth", async ({ request }) => {
        // console.log(quiz_data);
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        // maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.post(`/api/v2/job/${first_job.slug}/quiz`, {
            headers: maliciousHeaders,
            data: quiz_data
        });

        expect.soft(response.status()).toBe(400);

        const body = await response.json();
        // console.log(body);
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });
});
