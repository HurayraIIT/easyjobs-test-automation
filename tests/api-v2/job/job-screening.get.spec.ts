// GET: /api/v2/job/${first_job.slug}/screening

import { test, expect } from "@playwright/test";
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { addScreeningToJob, createJob, deleteAllDraftJobs } from "@datafactory/job";
import { createQuestionSet, deleteAllQuestionSets, getQuestionSetById } from "@datafactory/question-group";

test.describe("/api/v2/job/${first_job.slug}/screening GET requests @company", async () => {
    let first_job = null;
    let new_question_set_id = null;
    let questions = null;
    let screening_data = null;
    let job_with_screening = null;

    test.beforeAll(async () => {
        first_job = await createJob(authObjects.companyOneAuthHeaders);
        new_question_set_id = await createQuestionSet(authObjects.companyOneAuthHeaders);
        questions = await getQuestionSetById(authObjects.companyOneAuthHeaders, new_question_set_id);
        // console.log(questions);
        screening_data = {
            "job_id": first_job.id,
            "note": questions.note,
            "internal_note": questions.internal_note,
            "questions": questions.questions
        };
        job_with_screening = await addScreeningToJob(authObjects.companyOneAuthHeaders, first_job.slug, screening_data);
    });

    test.afterAll(async () => {
        await deleteAllDraftJobs(authObjects.companyOneAuthHeaders);
        await deleteAllQuestionSets(authObjects.companyOneAuthHeaders);
    });

    test("GET should be able to fetch screening questions from a job @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/job/${first_job.slug}/screening`, {
            headers: authObjects.companyOneAuthHeaders,
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // console.log(body);
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.message).toBe(null);
        expect(body.data.screening_group.name).toBe("Auto");
        expect(body.data.screening_group.exam_type).toBe("Screening");
        expect(body.data.screening_group.exam_duration).toBe(null);
        expect(body.data.screening_group.marks_per_question).toBe(null);
        expect(body.data.screening_group.internal_note).toBe(screening_data.internal_note);
        expect(body.data.screening_group.note).toBe(screening_data.note);
        expect(body.data.questions.length).toBe(screening_data.questions.length);
    });

    test("GET should not be able to fetch screening questions from a job of another company @security", async ({ request }) => {
        const response = await request.get(`/api/v2/job/${first_job.slug}/screening`, {
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

    test("GET should not be able to fetch screening questions from a job by a candidate @security", async ({ request }) => {
        const response = await request.get(`/api/v2/job/${first_job.slug}/screening`, {
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

    test("GET should not be able to fetch screening questions from a job without auth", async ({ request }) => {
        const response = await request.get(`/api/v2/job/${first_job.slug}/screening`, {
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

    test("GET fetch screening questions from an invalid job", async ({ request }) => {
        const response = await request.get(`/api/v2/job/invalid-job-slug/screening`, {
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
