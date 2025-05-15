// GET: /api/v2/job/published

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { deleteAllDraftJobs, createDraftJob, createPublishedJob, deleteAllPublishedJobs } from '@datafactory/job';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/job/published GET requests @company", async () => {
    let new_draft_job = null;
    let new_published_job = null;

    test.beforeAll(async () => {
        await deleteAllDraftJobs(authObjects.companyOneAuthHeaders);
        await deleteAllPublishedJobs(authObjects.companyOneAuthHeaders);

        new_draft_job = await createDraftJob(authObjects.companyOneAuthHeaders);
        new_published_job = await createPublishedJob(authObjects.companyOneAuthHeaders);
    });

    test.afterAll(async () => {
        await deleteAllDraftJobs(authObjects.companyOneAuthHeaders);
        await deleteAllPublishedJobs(authObjects.companyOneAuthHeaders);
    });

    test("GET with valid company credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/job/published`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body.data);
        // console.log(body.data.data[0]);
        expect(body.status).toBe("SUCCESS");
        expect(body.message).toBe(null);

        expect(body.data.data[0].id).toBe(new_published_job.id);
        expect(body.data.data[0].title).toBe(new_published_job.title);
        expect(body.data.data[0].slug).toBe(new_published_job.slug);
        expect(body.data.data[0].banner_image).toBe(new_published_job.image);
        expect(body.data.data[0].category.id).toBe(new_published_job.category_id);
        expect(body.data.data[0].status).toBe(2);
        expect(body.data.data[0].expire_at).toBe("01 Jan, 2030");
        expect(body.data.data[0].follow).toBe(1);
        expect(body.data.data[0].applicants).toEqual([]);
        expect(body.data.data[0].applicant_count).toBe(0);
        expect(body.data.data[0].pipeline_view_mode).toBe(1);
    });

    test("GET search with valid company credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/job/published?search=${new_published_job.title}`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();

        expect(body.data.data[0].slug).toBe(new_published_job.slug);
        expect(body.data.data[0].title).toBe(new_published_job.title);
    });

    test("GET search with another company credentials @security", async ({ request }) => {
        const response = await request.get(`/api/v2/job/published?search=${new_published_job.title}`, {
            headers: authObjects.companyTwoAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // console.log(body);

        expect(body.status).toBe("SUCCESS");
        expect(body.message).toBe(null);
        expect(body.data.data).toStrictEqual([]);
    });

    test("GET with valid candidate credentials", async ({ request }) => {
        const response = await request.get(`/api/v2/job/published`, {
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
        const response = await request.get(`/api/v2/job/published`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });
});
