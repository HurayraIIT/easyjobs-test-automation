//POST: /api/v2/company/setting/pipeline

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { faker } from '@faker-js/faker';
import { createAssertions } from "@helpers/createAssertions";

const data = {
    "name": `Pipeline: ${faker.hacker.noun()} ${faker.color.human()} ${faker.hacker.verb()}`,
    "steps": [
        { "label": "Applied", "type": 1, "edit": false, "isRequired": false },
        { "label": "Remote Interview", "type": 50, "edit": false },
        { "label": "Medical Screening", "type": 10, "edit": false },
        { "label": "Selected", "type": 99, "edit": false, "isRequired": false },
        { "label": "Rejected", "type": 100, "edit": false, "isRequired": false, "is_required": false }
    ]
};

test.describe("/api/v2/company/setting/pipeline POST requests @company", async () => {
    test("POST with valid credentials @happy", async ({ request }) => {
        const response = await request.post(`/api/v2/company/setting/pipeline`, {
            headers: authObjects.companyOneAuthHeaders,
            data: data
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.name).toBe(data.name);
        expect(body.data.steps[0].label).toBe("Applied");
        expect(body.data.steps[0].type).toBe(1);
        expect(body.data.steps[1].label).toBe("Remote Interview");
        expect(body.data.steps[1].type).toBe(50);
        expect(body.data.steps[2].label).toBe("Medical Screening");
        expect(body.data.steps[2].type).toBe(10);
        expect(body.data.steps[3].label).toBe("Selected");
        expect(body.data.steps[3].type).toBe(99);
        expect(body.data.steps[4].label).toBe("Rejected");
        expect(body.data.steps[4].type).toBe(100);
        expect(body.message).toBe("Pipeline added.");
    });

    test("POST with invalid credentials", async ({ request }) => {
        const response = await request.post(`/api/v2/company/setting/pipeline`, {
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

        const response = await request.post(`/api/v2/company/setting/pipeline`, {
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
        const response = await request.post(`/api/v2/company/setting/pipeline`, {
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