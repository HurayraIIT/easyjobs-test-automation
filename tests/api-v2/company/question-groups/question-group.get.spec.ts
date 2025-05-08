// GET: /api/v2/company/question/group/{group}

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createQuestionSet, deleteAllQuestionSets, deleteQuestionSetById, getQuestionSetById } from '@datafactory/question-group';

test.describe("/api/v2/company/question/group/{group} GET requests @company", async () => {
    test("GET with valid credentials @happy", async ({ request }) => {
        const set_id = await createQuestionSet(authObjects.companyOneAuthHeaders);
        const response = await request.get(`/api/v2/company/question/group/${set_id}`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);
        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.id).toBe(set_id);
        expect(body.data.set_type).toBeTruthy();
        expect(body.data.set_name).toBeTruthy();
        expect(body.data.note).toBeTruthy();
        expect(body.data.internal_note).toBeTruthy();
        expect(body.data.exam_duration).toBeNull();
        expect(body.data.marks_per_question).toBeNull();
        expect(body.message).toBeNull();
    });

    test("GET with company two credentials @security", async ({ request }) => {
        const set = await createQuestionSet(authObjects.companyOneAuthHeaders);
        const response = await request.get(`/api/v2/company/question/group/${set.id}`, {
            headers: authObjects.companyTwoAuthHeaders
        });

        expect.soft(response.status()).toBe(480);
        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have sufficient permissions.");
    });

    test("GET without auth token @security", async ({ request }) => {
        const set = await createQuestionSet(authObjects.companyOneAuthHeaders);
        const response = await request.get(`/api/v2/company/question/group/${set.id}`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });

    test("GET with invalid ID but valid auth token", async ({ request }) => {
        const response = await request.get(`/api/v2/company/question/group/123`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have sufficient permissions.");
    });
});