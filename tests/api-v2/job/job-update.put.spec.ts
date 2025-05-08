// PUT: /api/v2/job/${job_slug}/update

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { deleteAllDraftJobs, createJob, getDataForJobCreate } from '@datafactory/job';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/job/${job_slug}/update PUT requests @company", async () => {
    let first_job_data = null;
    let first_job = null;
    test.beforeAll(async () => {
        // await deleteAllDraftJobs(authObjects.companyOneAuthHeaders);
        first_job_data = await getDataForJobCreate();
        first_job = await createJob(authObjects.companyOneAuthHeaders, first_job_data);
    });

    test.afterAll(async () => {
        await deleteAllDraftJobs(authObjects.companyOneAuthHeaders);
    });

    test("PUT update with valid company credentials @happy", async ({ request }) => {
        let changed_job_data = await getDataForJobCreate();
        changed_job_data.vacancies = '5';
        // console.log(changed_job_data);
        const response = await request.put(`/api/v2/job/${first_job.slug}/update`, {
            headers: authObjects.companyOneAuthHeaders,
            data: changed_job_data
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.message).toBe("Job updated.");
        expect(body.status).toBe("SUCCESS");
        expect(body.data.id).toBe(first_job.id);
        expect(body.data.hideCoverPhoto).toBe(first_job.hideCoverPhoto);
        expect(body.data.title).not.toBe(first_job.title);
        expect(body.data.vacancies).not.toBe(first_job.vacancies);
        expect(body.data.vacancies).toBe(5);
    });

    test("PUT update with another company credentials @security", async ({ request }) => {
        let changed_job_data = await getDataForJobCreate();
        changed_job_data.vacancies = '6';
        // console.log(changed_job_data);
        const response = await request.put(`/api/v2/job/${first_job.slug}/update`, {
            headers: authObjects.companyTwoAuthHeaders,
            data: changed_job_data
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Unauthorized Access");
    });

    test("PUT update with a valid candidate credentials @security", async ({ request }) => {
        let changed_job_data = await getDataForJobCreate();
        changed_job_data.vacancies = '7';
        // console.log(changed_job_data);
        const response = await request.put(`/api/v2/job/${first_job.slug}/update`, {
            headers: authObjects.candidateOneAuthHeaders,
            data: changed_job_data
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });

    test("PUT update without credentials", async ({ request }) => {
        let changed_job_data = await getDataForJobCreate();
        changed_job_data.vacancies = '8';
        // console.log(changed_job_data);
        const response = await request.put(`/api/v2/job/${first_job.slug}/update`, {
            headers: {
                "Accept": "application/json",
            },
            data: changed_job_data
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.message).toBe("Unauthenticated.");
    });
});
