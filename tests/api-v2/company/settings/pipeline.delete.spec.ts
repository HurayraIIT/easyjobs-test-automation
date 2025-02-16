//DELETE: /api/v2/company/setting/pipeline/${pipeline_id}/delete

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { faker } from '@faker-js/faker';
import { createAssertions } from "@helpers/createAssertions";
import { createNewPipeline, getAllPipelines } from '@datafactory/pipeline';

test.describe("/api/v2/company/setting/pipeline/${pipeline_id}/delete DELETE requests @company", async () => {
    test("DELETE with valid credentials @happy", async ({ request }) => {
        let new_pipeline = await createNewPipeline(authObjects.companyOneAuthHeaders);
        let all_pipelines = await getAllPipelines(authObjects.companyOneAuthHeaders);
        expect(new_pipeline.name).toBe(all_pipelines[all_pipelines.length-1].name);

        const response = await request.delete(`/api/v2/company/setting/pipeline/${all_pipelines.length - 1}/delete`, {
            headers: authObjects.companyOneAuthHeaders,
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Pipeline removed.");

        all_pipelines = await getAllPipelines(authObjects.companyOneAuthHeaders);
        expect(new_pipeline.name).not.toBe(all_pipelines[all_pipelines.length - 1].name);
    });

    test("DELETE with invalid credentials", async ({ request }) => {
        let new_pipeline = await createNewPipeline(authObjects.companyOneAuthHeaders);
        let all_pipelines = await getAllPipelines(authObjects.companyOneAuthHeaders);
        expect(new_pipeline.name).toBe(all_pipelines[all_pipelines.length - 1].name);

        const response = await request.delete(`/api/v2/company/setting/pipeline/${all_pipelines.length - 1}/delete`, {
            headers: {
                "Accept": "application/json",
            },
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.message).toBe("Unauthenticated.");
    });

    test("DELETE with valid credentials but another company ID", async ({ request }) => {
        let new_pipeline = await createNewPipeline(authObjects.companyOneAuthHeaders);
        let all_pipelines = await getAllPipelines(authObjects.companyOneAuthHeaders);
        expect(new_pipeline.name).toBe(all_pipelines[all_pipelines.length - 1].name);

        // Company two should not be able to modify data from company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.delete(`/api/v2/company/setting/pipeline/${all_pipelines.length - 1}/delete`, {
            headers: maliciousHeaders,
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("DELETE with candidate auth", async ({ request }) => {
        let new_pipeline = await createNewPipeline(authObjects.companyOneAuthHeaders);
        let all_pipelines = await getAllPipelines(authObjects.companyOneAuthHeaders);
        expect(new_pipeline.name).toBe(all_pipelines[all_pipelines.length - 1].name);

        const response = await request.delete(`/api/v2/company/setting/pipeline/${all_pipelines.length - 1}/delete`, {
            headers: authObjects.candidateOneAuthHeaders,
        });

        expect(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });

    test("DELETE with invalid index of pipeline", async ({ request }) => {
        let new_pipeline = await createNewPipeline(authObjects.companyOneAuthHeaders);
        let all_pipelines = await getAllPipelines(authObjects.companyOneAuthHeaders);
        expect(new_pipeline.name).toBe(all_pipelines[all_pipelines.length - 1].name);

        const response = await request.delete(`/api/v2/company/setting/pipeline/9999999/delete`, {
            headers: authObjects.companyOneAuthHeaders,
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });
});