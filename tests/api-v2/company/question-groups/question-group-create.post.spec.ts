//POST: /api/v2/company/question/group/create

import { test, expect } from "@playwright/test";
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createQuestionSet, deleteQuestionSetById, getAllQuestionSets, getRandomQuestionSetData } from "@datafactory/question-group";

test.describe("/api/v2/company/question/group/create POST requests @company", async () => {
    test("POST can create a new question set @happy", async ({ request }) => {
        // Create a new question set
        const question_set_data = getRandomQuestionSetData();
        const response = await request.post('/api/v2/company/question/group/create', {
            headers: authObjects.companyOneAuthHeaders,
            data: question_set_data
        });

        expect(response.status()).toBe(200);
        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Saved.");

        // Verify that the question set was created
        let question_set = await getAllQuestionSets(authObjects.companyOneAuthHeaders);
        let recent_created_set: any;
        for (let set of question_set) {
            if (set.name === question_set_data.set_name) {
                recent_created_set = set;
                break;
            }
        }
        // await createAssertions(recent_created_set);
        expect(recent_created_set.id).toBeGreaterThan(0);
        expect(recent_created_set.name).toBe(question_set_data.set_name);
        expect(recent_created_set.company_id).toBe(Number(authObjects.companyOneAuthHeaders['Company-Id']));
        expect(recent_created_set.exam_type).toStrictEqual(question_set_data.set_type);
        expect(recent_created_set.total_questions).toBe(question_set_data.questions.length);
        expect(recent_created_set.last_update).toBeTruthy();
        expect(recent_created_set.updated_by).toBeTruthy();
        expect(recent_created_set.created_by).toBeTruthy();
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

        expect(response.status()).toBe(400);
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

    test("POST with valid data but with candidate auth @security", async ({ request }) => {
        // Candidate should not be able to create a question set
        const question_set_data = getRandomQuestionSetData();
        const response = await request.post('/api/v2/company/question/group/create', {
            headers: authObjects.candidateOneAuthHeaders,
            data: question_set_data
        });

        expect(response.status()).toBe(480);
        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });
});
