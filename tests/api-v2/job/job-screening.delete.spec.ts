// DELETE: /api/v2/job/${first_job.slug}/screening

import { test, expect } from "@playwright/test";
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { addScreeningToJob, createJob, deleteAllDraftJobs } from "@datafactory/job";
import { createQuestionSet, deleteAllQuestionSets, getQuestionSetById } from "@datafactory/question-group";

test.describe("/api/v2/job/${first_job.slug}/screening DELETE requests @company", async () => {
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

    test("DELETE should be able to delete screening questions from a job @happy", async ({ request }) => {
        const response = await request.delete(`/api/v2/job/${first_job.slug}/screening`, {
            headers: authObjects.companyOneAuthHeaders,
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // console.log(body);
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.message).toBe("Screening questions successfully removed from job.");

        // Verify that the screening questions have been removed from the job
        const response2 = await request.get(`/api/v2/job/${first_job.slug}/screening`, {
            headers: authObjects.companyOneAuthHeaders,
        });
        expect.soft(response2.status()).toBe(200);
        const body2 = await response2.json();
        expect(body2.status).toBe("SUCCESS");
        expect(body2.data.screening_group).toBe("");
        expect(body2.data.questions).toStrictEqual([]);
    });

    test("DELETE should not be able to delete screening questions by another company @security", async ({ request }) => {
        const response = await request.delete(`/api/v2/job/${first_job.slug}/screening`, {
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

    test("DELETE should not be able to delete screening questions by a candidate @security", async ({ request }) => {
        const response = await request.delete(`/api/v2/job/${first_job.slug}/screening`, {
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
});
