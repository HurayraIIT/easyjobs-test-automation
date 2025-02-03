// GET: /api/v2/company/question/groups

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createQuestionSet, deleteAllQuestionSets, deleteQuestionSetById, getAllQuestionSets, getQuestionSetById } from '@datafactory/question-group';

test.describe("/api/v2/company/question/groups GET requests @company", async () => {
    test.afterAll(async () => {
        await deleteAllQuestionSets(authObjects.companyOneAuthHeaders);
    });

    test("GET with valid credentials @happy", async ({ request }) => {
        const set = await createQuestionSet(authObjects.companyOneAuthHeaders);

        expect(set.id).toBeGreaterThan(0);
    });

    test("GET without auth token", async ({ request }) => {
        const response = await request.get(`/api/v2/company/question/groups`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });

    test("GET with candidates auth token", async ({ request }) => {
        const response = await request.get(`/api/v2/company/question/groups`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });
});