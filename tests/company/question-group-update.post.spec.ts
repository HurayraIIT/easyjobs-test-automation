//POST /api/v2/company/question/group/{group}/update

import { test, expect } from "@playwright/test";
import { createAuthHeaders } from "@datafactory/auth";
import { createAssertions } from "@helpers/createAssertions";
import { createQuestionSet, deleteAllQuestionSets, deleteQuestionSetById, getRandomQuestionSetData } from "@datafactory/question-group";

test.describe("/api/v2/company/question/group/{group}/update POST requests @company", async () => {
    const companyEmail = `${process.env.COMPANY_EMAIL}`;
    const companyPassword = `${process.env.COMPANY_PASSWORD}`;

    let authHeaders: any;

    test.beforeEach(async () => {
        authHeaders = await createAuthHeaders(companyEmail, companyPassword);
    });

    test.afterAll(async () => {
        authHeaders = await createAuthHeaders(companyEmail, companyPassword);
        await deleteAllQuestionSets(authHeaders);
    });

    test("POST can update an existing question set @happy", async ({ request }) => {
        // Create a new question set
        const question_set = await createQuestionSet(authHeaders);
        expect(question_set.id).toBeGreaterThan(0);

        // Update the question set
        const question_set_data = getRandomQuestionSetData();
        question_set_data.id = question_set.id;
        const response = await request.post(`/api/v2/company/question/group/${question_set.id}/update`, {
            data: question_set_data,
            headers: authHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Saved.");
    });

    test("POST with empty data", async ({ request }) => {
        const question_set = await createQuestionSet(authHeaders);
        const response = await request.post(`/api/v2/company/question/group/${question_set.id}/update`, {
            data: {},
            headers: authHeaders
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
        const question_set = await createQuestionSet(authHeaders);
        const response = await request.post(`/api/v2/company/question/group/${question_set.id}/update`, {
            headers: authHeaders
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

    test("POST with valid data but no auth", async ({ request }) => {
        const question_set = await createQuestionSet(authHeaders);
        const response = await request.post(`/api/v2/company/question/group/${question_set.id}/update`, {
            data: question_set,
            headers: {
                "Accept": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.message).toBe('Unauthenticated.');
    });
});
