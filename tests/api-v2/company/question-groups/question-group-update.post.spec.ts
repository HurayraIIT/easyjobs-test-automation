//POST /api/v2/company/question/group/{group}/update

import { test, expect } from "@playwright/test";
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createQuestionSet, deleteAllQuestionSets, deleteQuestionSetById, getRandomQuestionSetData } from "@datafactory/question-group";

test.describe("/api/v2/company/question/group/{group}/update POST requests @company", async () => {
    // test.afterAll(async () => {
    //     await deleteAllQuestionSets(authObjects.companyOneAuthHeaders);
    // });

    test("POST can update an existing question set @happy", async ({ request }) => {
        // Create a new question set
        const question_set_id = await createQuestionSet(authObjects.companyOneAuthHeaders);
        expect(question_set_id).toBeGreaterThan(0);

        // Update the question set
        const question_set_data = getRandomQuestionSetData();
        question_set_data.id = question_set_id;
        const response = await request.post(`/api/v2/company/question/group/${question_set_id}/update`, {
            data: question_set_data,
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Saved.");
    });

    test("POST with valid data but another companies auth @security", async ({ request }) => {
        // Create a new question set
        const question_set_id = await createQuestionSet(authObjects.companyOneAuthHeaders);
        expect(question_set_id).toBeGreaterThan(0);

        // Update the question set
        const question_set_data = getRandomQuestionSetData();
        question_set_data.id = question_set_id;
        const response = await request.post(`/api/v2/company/question/group/${question_set_id}/update`, {
            data: question_set_data,
            headers: authObjects.companyTwoAuthHeaders
        });

        expect(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have sufficient permissions.");
    });

    test("POST with empty data", async ({ request }) => {
        const question_set_id = await createQuestionSet(authObjects.companyOneAuthHeaders);
        const response = await request.post(`/api/v2/company/question/group/${question_set_id}/update`, {
            data: {},
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(422);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message.set_name).toEqual(["Please provide a valid set name."]);
        expect(body.message.set_type).toEqual(["The field is required."]);
        expect(body.message.questions).toEqual(["The field is required."]);
    });

    test("POST with no data", async ({ request }) => {
        const question_set_id = await createQuestionSet(authObjects.companyOneAuthHeaders);
        const response = await request.post(`/api/v2/company/question/group/${question_set_id}/update`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(422);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message.set_name).toEqual(["Please provide a valid set name."]);
        expect(body.message.set_type).toEqual(["The field is required."]);
        expect(body.message.questions).toEqual(["The field is required."]);
    });

    test("POST with valid data but no auth @security", async ({ request }) => {
        const question_set_id = await createQuestionSet(authObjects.companyOneAuthHeaders);
        const response = await request.post(`/api/v2/company/question/group/${question_set_id}/update`, {
            data: question_set_id,
            headers: {
                "Accept": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.message).toBe('Unauthenticated.');
    });

    test("POST with valid data but candidates auth @security", async ({ request }) => {
        const question_set = await createQuestionSet(authObjects.companyOneAuthHeaders);
        const response = await request.post(`/api/v2/company/question/group/${question_set.id}/update`, {
            data: question_set,
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
