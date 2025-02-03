// DELETE: /api/v2/company/question/group/{group}

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from '@helpers/createAssertions';
import { createQuestionSet, deleteAllQuestionSets, deleteQuestionSetById } from '@datafactory/question-group';

test.describe("/api/v2/company/question/group/{group} DELETE requests @company", async () => {
    // test.afterAll(async () => {
    //     await deleteAllQuestionSets(authObjects.companyOneAuthHeaders);
    // });

    test("DELETE with valid set id and valid token @happy", async ({ request }) => {
        // Create a new question set
        const new_question_set = await createQuestionSet(authObjects.companyOneAuthHeaders);

        // Delete the question set
        const response = await request.delete(`/api/v2/company/question/group/${new_question_set.id}`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(200);
        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Deleted.");
    });

    test("DELETE with valid set id and another company token @security", async ({ request }) => {
        // Create a new question set
        const new_question_set = await createQuestionSet(authObjects.companyOneAuthHeaders);

        // Delete the question set
        const response = await request.delete(`/api/v2/company/question/group/${new_question_set.id}`, {
            headers: authObjects.companyTwoAuthHeaders
        });

        expect(response.status()).toBe(480);
        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have sufficient permissions.");
    });

    test("DELETE with valid set id and invalid token", async ({ request }) => {
        // Create a new question set
        const new_question_set = await createQuestionSet(authObjects.companyOneAuthHeaders);

        // Try to get the question set again
        const response = await request.get(`/api/v2/company/question/group/${new_question_set.id}`, {
            headers: {
                "Accept": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.message).toBe("Unauthenticated.");
    });

    test("DELETE with invalid int set id and valid token", async ({ request }) => {
        const response = await request.get(`/api/v2/company/question/group/123`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have sufficient permissions.");
    });

    test("DELETE with invalid string set id and valid token", async ({ request }) => {
        const response = await request.get(`/api/v2/company/question/group/abcdef`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have sufficient permissions.");
    });

    test("DELETE with valid set id and candidate token @security", async ({ request }) => {
        // Create a new question set
        const new_question_set = await createQuestionSet(authObjects.companyOneAuthHeaders);

        // Try to get the question set again
        const response = await request.get(`/api/v2/company/question/group/${new_question_set.id}`, {
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