// POST: /api/v2/job/{job}/change-status

import authObjects from '@datafactory/auth';
import { test, expect } from '@playwright/test';
import { createAssertions } from "@helpers/createAssertions";
import { deleteAllDraftJobs, createDraftJob, deleteAllPublishedJobs } from '@datafactory/job';
import { createCustomApplyField, deleteAllCustomApplyFields, getAllCustomApplyFields } from '@datafactory/custom-fields';

test.describe("/api/v2/job/{job}/change-status POST requests @company", async () => {
    let new_job = null;
    let job = null;
    let data = null;

    test.beforeAll(async () => {
        // await deleteAllDraftJobs(authObjects.companyOneAuthHeaders);
        new_job = await createDraftJob(authObjects.companyOneAuthHeaders);
        job = new_job.slug;
        data = { "status": 2 };
    });

    test.afterAll(async () => {
        await deleteAllPublishedJobs(authObjects.companyOneAuthHeaders);
    });

    test("POST with valid company credentials @happy", async ({ request }) => {
        const response = await request.post(`/api/v2/job/${job}/change-status`, {
            headers: authObjects.companyOneAuthHeaders,
            data: data
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // console.log(body.data.apply_rules);
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.status).toBe(data.status);
        expect(body.message).toBe("Job Published successfully.");
    });

    test("POST with empty data", async ({ request }) => {
        const response = await request.post(`/api/v2/job/${job}/change-status`, {
            headers: authObjects.companyOneAuthHeaders,
            data: {}
        });

        expect.soft(response.status()).toBe(422);

        const body = await response.json();
        // console.log(body.data.apply_rules);
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message.status).toEqual(["The status field is required."]);
    });

    // TODO: Need to get this fixed, status should not be any number
    test.skip("POST with invalid status", async ({ request }) => {
        const response = await request.post(`/api/v2/job/${job}/change-status`, {
            headers: authObjects.companyOneAuthHeaders,
            data: { "status": 999 }
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // console.log(body.data.status);
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        // expect(body.data).toEqual([]);
        expect(body.message).toBe("Job constants.change_status.999 successfully.");
    });

    test("POST with another company credentials @security", async ({ request }) => {
        const response = await request.post(`/api/v2/job/${job}/change-status`, {
            headers: authObjects.companyTwoAuthHeaders,
            data: data
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Unauthorized Access");
    });

    test("POST with valid candidate credentials", async ({ request }) => {
        const response = await request.post(`/api/v2/job/${job}/change-status`, {
            headers: authObjects.candidateOneAuthHeaders,
            data: data
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });

    test("POST without auth token", async ({ request }) => {
        const response = await request.post(`/api/v2/job/${job}/change-status`, {
            headers: {
                "ACCEPT": "application/json",
            },
            data: data
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });

    test("POST with invalid credentials", async ({ request }) => {
        // Company two should not be able to access data from company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        // maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.post(`/api/v2/job/${job}/change-status`, {
            headers: maliciousHeaders,
            data: data
        });
        expect.soft(response.status()).toBe(471);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });
});
