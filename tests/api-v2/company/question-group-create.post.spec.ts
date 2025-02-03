//POST: /api/v2/company/question/group/create

import { test, expect } from "@playwright/test";
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createQuestionSet, deleteQuestionSetById, getRandomQuestionSetData } from "@datafactory/question-group";

test.describe("/api/v2/company/question/group/create POST requests @company", async () => {
    test("POST can create a new question set @happy", async ({ request }) => {
        // Create a new question set
        const question_set = await createQuestionSet(authObjects.companyOneAuthHeaders);
        expect(question_set.id).toBeGreaterThan(0);

        await deleteQuestionSetById(authObjects.companyOneAuthHeaders, question_set.id);
    });

    test("POST with empty data", async ({ request }) => {
        const response = await request.post('/api/v2/company/question/group/create', {
            headers: authObjects.companyOneAuthHeaders,
            data: {}
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
        const response = await request.post('/api/v2/company/question/group/create', {
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

    test("POST with valid data but no auth", async ({ request }) => {
        const question_set_data = getRandomQuestionSetData();
        const response = await request.post('/api/v2/company/question/group/create', {
            headers: {
                "Accept": "application/json",
            },
            data: question_set_data
        });

        expect(response.status()).toBe(401);
        const body = await response.json();

        // await createAssertions(body);
        expect(body.message).toBe('Unauthenticated.');
    });
});
