//POST: /api/v2/company/question/group/create

import { test, expect } from "@playwright/test";
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createQuestionSet, deleteQuestionSetById, getAllQuestionSets, getQuestionSetById, getRandomQuestionSetData } from "@datafactory/question-group";

test.describe("/api/v2/company/question/group/create POST requests @company", async () => {
    test("POST can create a new question set @happy", async ({ request }) => {
        // Create a new question set
        const question_set_data = getRandomQuestionSetData();
        const response = await request.post('/api/v2/company/question/group/create', {
            headers: authObjects.companyOneAuthHeaders,
            data: question_set_data
        });

        expect.soft(response.status()).toBe(200);
        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.id).toBeGreaterThan(1);
        expect(body.message).toBe("Saved.");

        // Verify that the question set was created
        let recent_created_set = await getQuestionSetById(authObjects.companyOneAuthHeaders, body.data.id);
        expect(recent_created_set.set_type.id).toBe(question_set_data.set_type.id);
        expect(recent_created_set.set_type.name).toBe(question_set_data.set_type.name);
        expect(recent_created_set.set_name).toBe(question_set_data.set_name);
        expect(recent_created_set.note).toBe(question_set_data.note);
        expect(recent_created_set.internal_note).toBe(question_set_data.internal_note);
    });

    test("POST using company two creds but with company one ID @security", async ({ request }) => {
        // Company two should not be able to create a question set for company one
        // Create a new question set
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const question_set_data = getRandomQuestionSetData();
        const response = await request.post('/api/v2/company/question/group/create', {
            headers: maliciousHeaders,
            data: question_set_data
        });

        expect.soft(response.status()).toBe(400);
        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("POST with empty data", async ({ request }) => {
        const response = await request.post('/api/v2/company/question/group/create', {
            headers: authObjects.companyOneAuthHeaders,
            data: {}
        });

        expect.soft(response.status()).toBe(422);
        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message.set_name).toEqual(["Please provide a valid set name."]);
        expect(body.message.set_type).toEqual(["The field is required."]);
        expect(body.message.questions).toEqual(["The field is required."]);
    });

    test("POST with no data", async ({ request }) => {
        const response = await request.post('/api/v2/company/question/group/create', {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(422);
        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message.set_name).toEqual(["Please provide a valid set name."]);
        expect(body.message.set_type).toEqual(["The field is required."]);
        expect(body.message.questions).toEqual(["The field is required."]);
    });

    test("POST with valid data but no auth", async ({ request }) => {
        const question_set_data = getRandomQuestionSetData();
        const response = await request.post('/api/v2/company/question/group/create', {
            headers: {
                "Accept": "application/json",
            },
            data: question_set_data
        });

        expect.soft(response.status()).toBe(401);
        const body = await response.json();

        // await createAssertions(body);
        expect(body.message).toBe('Unauthenticated.');
    });

    test("POST with valid data but with candidate auth @security", async ({ request }) => {
        // Candidate should not be able to create a question set
        const question_set_data = getRandomQuestionSetData();
        const response = await request.post('/api/v2/company/question/group/create', {
            headers: authObjects.candidateOneAuthHeaders,
            data: question_set_data
        });

        expect.soft(response.status()).toBe(480);
        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });
});
