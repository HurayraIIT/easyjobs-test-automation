// GET: /api/v2/job/draft

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { deleteAllDraftJobs, createJob } from '@datafactory/job';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/job/draft GET requests @company", async () => {
    let new_job = null;
    test.beforeAll(async () => {
        await deleteAllDraftJobs(authObjects.companyOneAuthHeaders);
        await deleteAllDraftJobs(authObjects.companyTwoAuthHeaders);
        new_job = await createJob(authObjects.companyOneAuthHeaders);
        // console.log(new_job);
    });

    test("GET with valid company credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/job/draft`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // console.log(body.data);

        expect(body.data.current_page).toBe(1);
    });

    test("GET search with valid company credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/job/draft?search=${new_job.title}`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();

        expect(body.data.data[0].slug).toBe(new_job.slug);
        expect(body.data.data[0].title).toBe(new_job.title);
    });

    test("GET search with another company credentials @security", async ({ request }) => {
        const response = await request.get(`/api/v2/job/draft?search=${new_job.title}`, {
            headers: authObjects.companyTwoAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // console.log(body.data.data);

        expect(body.data.data).toStrictEqual([]);
    });

    test("GET with valid candidate credentials", async ({ request }) => {
        const response = await request.get(`/api/v2/job/draft`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });

    test("GET without auth token", async ({ request }) => {
        const response = await request.get(`/api/v2/job/draft`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });
});
