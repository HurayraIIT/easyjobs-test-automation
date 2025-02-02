//POST: /api/v2/company/question/group/create

import { test, expect } from "@playwright/test";
import { createAuthHeaders } from "@datafactory/auth";
import { createAssertions } from "@helpers/createAssertions";
import { createQuestionSet, deleteQuestionSetById, getRandomQuestionSetData } from "@datafactory/question-group";

test.describe("/api/v2/company/question/group/create POST requests @company", async () => {
    const companyEmail = `${process.env.COMPANY_EMAIL}`;
    const companyPassword = `${process.env.COMPANY_PASSWORD}`;

    let authHeaders: any;

    test.beforeEach(async () => {
        authHeaders = await createAuthHeaders(companyEmail, companyPassword);
    });

    test("POST can create a new question set @happy", async ({ request }) => {
        // Create a new question set
        const question_set = await createQuestionSet(authHeaders);
        expect(question_set.id).toBeGreaterThan(0);

        await deleteQuestionSetById(authHeaders, question_set.id);
    });

    test("POST with empty data", async ({ request }) => {
        const response = await request.post('/api/v2/company/question/group/create', {
            headers: authHeaders,
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
