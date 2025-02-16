//POST: /api/v2/company/setting/pipeline/${pipeline_id}/update

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { faker } from '@faker-js/faker';
import { createAssertions } from "@helpers/createAssertions";
import { createNewPipeline, deleteAllPipelines } from '@datafactory/pipeline';

const data = {
    "name": `new name test`,
    "steps": [
        { "label": "Applied", "type": 1, "edit": false, "isRequired": false },
        { "label": "Selected", "type": 99, "edit": false, "isRequired": false },
        { "label": "Rejected", "type": 100, "edit": false, "isRequired": false, "is_required": false }
    ]
};

test.describe("/api/v2/company/setting/pipeline/${pipeline_id}/update POST requests @company", async () => {
    let new_pipeline: any;

    test.beforeAll(async () => {
        await deleteAllPipelines(authObjects.companyOneAuthHeaders);
        new_pipeline = await createNewPipeline(authObjects.companyOneAuthHeaders);
    });

    test("POST with valid credentials @happy", async ({ request }) => {
        const response = await request.post(`/api/v2/company/setting/pipeline/1/update`, {
            headers: authObjects.companyOneAuthHeaders,
            data: data
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.message).toBe("Pipeline updated.");
        expect(body.status).toBe("SUCCESS");
        expect(body.data.name).toBe("new name test");
        expect(body.data.steps.length).toBe(3);
    });

    test("POST with invalid credentials", async ({ request }) => {
        const response = await request.post(`/api/v2/company/setting/pipeline/1/update`, {
            headers: {
                "Accept": "application/json"
            },
            data: data
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe("Unauthenticated.");
    });

    test("POST with valid credentials but another company ID", async ({ request }) => {
        // Company two should not be able to modify data from company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.post(`/api/v2/company/setting/pipeline/1/update`, {
            headers: maliciousHeaders,
            data: data
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("POST with candidate auth", async ({ request }) => {
        const response = await request.post(`/api/v2/company/setting/pipeline/1/update`, {
            headers: authObjects.candidateOneAuthHeaders,
            data: data
        });

        expect(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });
});