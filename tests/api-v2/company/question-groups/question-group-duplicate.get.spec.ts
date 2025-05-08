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
        const set_id = await createQuestionSet(authObjects.companyOneAuthHeaders);
        const response = await request.get(`/api/v2/company/question/group/${set_id}/duplicate`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        const original_set = await getQuestionSetById(authObjects.companyOneAuthHeaders, set_id);
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.name).toBe(original_set.set_name);
        expect(body.data.exam_type).toBe(original_set.set_type.id);
        expect(body.data.company_id).toBe(Number(authObjects.companyOneAuthHeaders['Company-Id']));
        expect(body.data.exam_duration).toBeNull();
        expect(body.data.marks_per_question).toBeNull();
        expect(body.data.deleted_at).toBeNull();
        expect(body.data.internal_note).toBe(original_set.internal_note);
        expect(body.data.note).toBe(original_set.note);
        expect(body.data.created_at).toBeTruthy();
        expect(body.data.updated_at).toBeTruthy();
        expect(body.data.id).toBeGreaterThan(original_set.id);
        expect(body.message).toBe("Question set duplicated.");
    });

    // TODO: Fix this test, fails when run with other tests
    test("GET duplicate with other companies credentials @security", async ({ request }) => {
        // Company two should not be able to duplicate company one's question set
        const set_id = await createQuestionSet(authObjects.companyOneAuthHeaders);
        const response = await request.get(`/api/v2/company/question/group/${set_id}/duplicate`, {
            headers: authObjects.companyTwoAuthHeaders
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have sufficient permissions.");
    });

    test("GET duplicate with candidates credentials @security", async ({ request }) => {
        // Candidates should not be able to duplicate question set
        const set_id = await createQuestionSet(authObjects.companyOneAuthHeaders);
        const response = await request.get(`/api/v2/company/question/group/${set_id}/duplicate`, {
            headers: authObjects.candidateOneAuthHeaders
        });
        expect.soft(response.status()).toBe(480);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });

    test("GET duplicate without auth token @security", async ({ request }) => {
        const set_id = await createQuestionSet(authObjects.companyOneAuthHeaders);
        const response = await request.get(`/api/v2/company/question/group/${set_id}/duplicate`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });

    test("GET duplicate with invalid ID but valid auth token", async ({ request }) => {
        const response = await request.get(`/api/v2/company/question/group/123/duplicate`, {
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