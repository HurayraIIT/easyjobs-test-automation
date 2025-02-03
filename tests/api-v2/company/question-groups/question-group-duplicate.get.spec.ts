//GET /api/v2/company/question/group/{group}/duplicate

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createQuestionSet, deleteAllQuestionSets, deleteQuestionSetById, duplicateQuestionSet, getQuestionSetById } from '@datafactory/question-group';

test.describe("/api/v2/company/question/group/{group}/duplicate GET requests @company", async () => {
    // test.afterAll(async () => {
    //     await deleteAllQuestionSets(authObjects.companyOneAuthHeaders);
    // });

    test("GET duplicate with valid credentials @happy", async ({ request }) => {
        // Company one should be able to duplicate his own question set
        const set = await createQuestionSet(authObjects.companyOneAuthHeaders);
        const question_set = await duplicateQuestionSet(authObjects.companyOneAuthHeaders, set.id);

        expect(question_set.id).toBeGreaterThan(set.id);
    });

    test("GET duplicate without auth token", async ({ request }) => {
        const set = await createQuestionSet(authObjects.companyOneAuthHeaders);
        const response = await request.get(`/api/v2/company/question/group/${set.id}/duplicate`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });

    test("GET duplicate with invalid ID but valid auth token", async ({ request }) => {
        const response = await request.get(`/api/v2/company/question/group/123/duplicate`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have sufficient permissions.");
    });
});