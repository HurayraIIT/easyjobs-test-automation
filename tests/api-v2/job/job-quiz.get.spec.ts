// GET: /api/v2/job/{job}/quiz

import { test, expect } from "@playwright/test";
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { addQuizToJob, createJob, deleteAllDraftJobs } from "@datafactory/job";
import { createQuestionSet, deleteAllQuestionSets, getQuestionSetById, QuestionSetType } from "@datafactory/question-group";

test.describe("/api/v2/job/{job}/quiz GET requests @company", async () => {
    let first_job = null;
    let new_question_set_id = null;
    let questions = null;
    let quiz_data = null;
    let job_with_quiz = null;

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
        job_with_quiz = await addQuizToJob(authObjects.companyOneAuthHeaders, first_job.slug, quiz_data);
    });

    test.afterAll(async () => {
        await deleteAllDraftJobs(authObjects.companyOneAuthHeaders);
        await deleteAllQuestionSets(authObjects.companyOneAuthHeaders);
    });

    test("GET should be able to fetch quiz questions from a job @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/job/${first_job.slug}/quiz`, {
            headers: authObjects.companyOneAuthHeaders,
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // console.log(body);
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.message).toBe(null);
        expect(body.data.quiz_group.name).toBe("auto-naming-quiz");
        expect(body.data.quiz_group.exam_type).toBe("Quiz");
        expect(body.data.quiz_group.exam_duration).toBe(parseInt(quiz_data.exam_duration));
        expect(body.data.quiz_group.marks_per_question).toBe(parseInt(quiz_data.marks_per_question));
        expect(body.data.quiz_group.internal_note).toBe(quiz_data.internal_note);
        expect(body.data.quiz_group.note).toBe(quiz_data.note);
        expect(body.data.questions.length).toBe(quiz_data.questions.length);
    });

    test("GET should not be able to fetch quiz questions from a job of another company @security", async ({ request }) => {
        const response = await request.get(`/api/v2/job/${first_job.slug}/quiz`, {
            headers: authObjects.companyTwoAuthHeaders,
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();
        // console.log(body);
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Unauthorized Access");
    });

    test("GET should not be able to fetch quiz questions from a job by a candidate @security", async ({ request }) => {
        const response = await request.get(`/api/v2/job/${first_job.slug}/quiz`, {
            headers: authObjects.candidateOneAuthHeaders,
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();
        // console.log(body);
        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });

    test("GET should not be able to fetch quiz questions from a job without auth", async ({ request }) => {
        const response = await request.get(`/api/v2/job/${first_job.slug}/quiz`, {
            headers: {
                "Accept": "application/json",
            },
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        // console.log(body);
        // await createAssertions(body);
        expect(body.message).toBe("Unauthenticated.");
    });

    test("GET fetch quiz questions from an invalid job", async ({ request }) => {
        const response = await request.get(`/api/v2/job/invalid-job-slug/quiz`, {
            headers: authObjects.companyOneAuthHeaders,
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();
        // console.log(body);
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Unauthorized Access");
    });
});
