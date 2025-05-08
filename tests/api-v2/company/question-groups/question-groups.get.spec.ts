// GET: /api/v2/company/question/groups

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createQuestionSet, deleteAllQuestionSets, deleteQuestionSetById, getAllQuestionSets, getQuestionSetById } from '@datafactory/question-group';

test.describe("/api/v2/company/question/groups GET requests @company", async () => {
    // test.afterAll(async () => {
    //     await deleteAllQuestionSets(authObjects.companyOneAuthHeaders);
    // });

    test("GET with valid credentials @happy", async ({ request }) => {
        const response = await request.get('/api/v2/company/question/groups', {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);
        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.length).toBeGreaterThanOrEqual(0);
        expect(body.message).toBeNull();
    });

    test("GET with another company credentials @security", async ({ request }) => {
        // Company two should not be able to access data from company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.get('/api/v2/company/question/groups', {
            headers: maliciousHeaders
        });

        expect.soft(response.status()).toBe(400);
        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("GET without auth token", async ({ request }) => {
        const response = await request.get(`/api/v2/company/question/groups`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });

    test("GET with candidates auth token @security", async ({ request }) => {
        const response = await request.get(`/api/v2/company/question/groups`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });
});