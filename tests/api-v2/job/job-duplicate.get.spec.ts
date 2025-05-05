// GET: /api/v2/job/${job_slug}/duplicate

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from '@helpers/createAssertions';
import { createJob, deleteAllDraftJobs } from '@datafactory/job';

test.describe("/api/v2/job/${job_slug}/duplicate GET requests @company", async () => {
    test.afterAll(async () => {
        await deleteAllDraftJobs(authObjects.companyOneAuthHeaders);
    });

    test("GET duplicate with valid job slug and valid token @happy", async ({ request }) => {
        const new_job = await createJob(authObjects.companyOneAuthHeaders);
        const job_slug = new_job.slug;
        const response = await request.get(`/api/v2/job/${job_slug}/duplicate`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.id).toBe(new_job.id+1);
        expect(body.data.slug).toContain(job_slug);
        expect(body.message).toBe("Job duplicated.");
    });

    // TODO: Need to fix the 500 server error
    test.skip("GET duplicate with valid job slug and another company token @security", async ({ request }) => {
        const new_job = await createJob(authObjects.companyOneAuthHeaders);
        const job_slug = new_job.slug;
        const response = await request.get(`/api/v2/job/${job_slug}/duplicate`, {
            headers: authObjects.companyTwoAuthHeaders
        });

        expect(response.status()).toBe(400);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("GET duplicate with valid job slug and candidate token @security", async ({ request }) => {
        const new_job = await createJob(authObjects.companyOneAuthHeaders);
        const job_slug = new_job.slug;
        const response = await request.get(`/api/v2/job/${job_slug}/duplicate`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });

    // TODO: Need to fix the 500 server error
    test.skip("GET duplicate with already deleted job slug", async ({ request }) => {
        // First create and delete a job
        const new_job = await createJob(authObjects.companyOneAuthHeaders);
        const job_slug = new_job.slug;

        const response = await request.delete(`/api/v2/job/${job_slug}/delete`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.message).toBe("Job deleted.");

        // Now try to delete the same job again
        const response2 = await request.get(`/api/v2/job/${job_slug}/duplicate`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response2.status()).toBe(480);

        const body2 = await response2.json();

        await createAssertions(body);
        expect(body2.status).toBe("FAILED");
        expect(body2.data).toEqual([]);
        expect(body2.message).toBe("Unauthorized Access");
    });

    test("GET duplicate with valid job slug and without token", async ({ request }) => {
        const new_job = await createJob(authObjects.companyOneAuthHeaders);
        const job_slug = new_job.slug;

        const response = await request.get(`/api/v2/job/${job_slug}/duplicate`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.message).toBe("Unauthenticated.");
    });

    // TODO: Need to fix the 500 server error
    test.skip("GET duplicate with invalid job slug and valid token", async ({ request }) => {
        const response = await request.get(`/api/v2/job/invalidjobslug/duplicate`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(400);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });
});