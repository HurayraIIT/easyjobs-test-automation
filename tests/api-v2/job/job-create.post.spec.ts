// POST: /api/v2/job/create

import { test, expect } from "@playwright/test";
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { getDataForJobCreate, createJob } from "@datafactory/job";

test.describe("/api/v2/job/create POST requests @company", async () => {
    test("POST can create a new job @happy", async ({ request }) => {
        const job_data = await getDataForJobCreate();
        const response = await request.post('/api/v2/job/create', {
            headers: authObjects.companyOneAuthHeaders,
            data: job_data
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        // console.log(body);
        //await createAssertions(body);

        expect(body.status).toBe("SUCCESS");
        expect(body.message).toBe("Job created.");

        expect(body.data.title).toBe(job_data.title);
        expect(body.data.category_id).toBe(job_data.category.id);
        expect(body.data.requirements).toBe(job_data.details);
        expect(body.data.responsibilies).toBe(job_data.responsibilities);
    });

    test("POST with empty data", async ({ request }) => {
        const response = await request.post('/api/v2/job/create', {
            data: {},
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(422);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message.category).toEqual(["The category field is required."]);
        expect(body.message.title).toEqual(["The title field is required."]);
        expect(body.message.expire_at).toEqual(["The expire at field is required."]);
        expect(body.message.details).toEqual(["The details field is required."]);
        expect(body.message.skills).toEqual(["The skills field is required.", "Please select skill."]);
        expect(body.message.salary_type).toEqual(["The salary type field is required."]);
        expect(body.message.employment_type).toEqual(["The employment type field is required."]);
    });

    test("POST with valid data but no auth", async ({ request }) => {
        const job_data = await getDataForJobCreate();
        const response = await request.post('/api/v2/job/create', {
            data: job_data,
            headers: {
                "Accept": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();

        //await createAssertions(body);
        expect(body.message).toBe('Unauthenticated.');
    });

    test("POST with candidate auth @security", async ({ request }) => {
        const job_data = await getDataForJobCreate();
        const response = await request.post('/api/v2/job/create', {
            headers: authObjects.candidateOneAuthHeaders,
            data: job_data
        });

        expect(response.status()).toBe(480);

        const body = await response.json();
        // console.log(body);
        // await createAssertions(body);

        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });
});
