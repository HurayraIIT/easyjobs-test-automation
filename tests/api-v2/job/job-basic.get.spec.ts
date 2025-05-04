// GET: /api/v2/job/{new_job}/basic

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { deleteAllDraftJobs, createJob } from '@datafactory/job';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/job/{new_job}/basic GET requests @company", async () => {
    let new_job = null;
    test.beforeAll(async () => {
        new_job = await createJob(authObjects.companyOneAuthHeaders);
        // console.log(new_job);
    });

    test("GET with valid company credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/job/${new_job.slug}/basic`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        // console.log(body);

        expect(body.id).toBe(new_job.id);
        expect(body.title).toBe(new_job.title);
        expect(body.slug).toBe(new_job.slug);
    });

    test("GET with another company credentials @security", async ({ request }) => {
        const response = await request.get(`/api/v2/job/${new_job.slug}/basic`, {
            headers: authObjects.companyTwoAuthHeaders
        });

        expect(response.status()).toBe(480);

        const body = await response.json();
        // await createAssertions(body);

        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Invalid Job ID");
    });

    // TODO: Need to fix the 500 server error
    test.skip("GET with valid candidate credentials @security", async ({ request }) => {
        const response = await request.get(`/api/v2/job/${new_job.slug}/basic`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect(response.status()).toBe(480);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });

    test("GET without auth token", async ({ request }) => {
        const response = await request.get(`/api/v2/job/${new_job.slug}/basic`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });
});
