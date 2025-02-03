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
        const response = await request.get(`/api/v2/company/question/group/${set.id}/duplicate`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.name).toBe(set.name);
        expect(body.data.exam_type).toBe(set.exam_type.id);
        expect(body.data.company_id).toBe(set.company_id);
        expect(body.data.exam_duration).toBeNull();
        expect(body.data.marks_per_question).toBeNull();
        expect(body.data.created_by).toBeTruthy();
        expect(body.data.updated_by).toBeTruthy();
        expect(body.data.deleted_at).toBeNull();
        expect(body.data.internal_note).toBeTruthy();
        expect(body.data.note).toBeTruthy();
        expect(body.data.created_at).toBeTruthy();
        expect(body.data.updated_at).toBeTruthy();
        expect(body.data.id).toBeGreaterThan(set.id);
        expect(body.message).toBe("Question set duplicated.");
    });

    test("GET duplicate with other companies credentials @security", async ({ request }) => {
        // Company two should not be able to duplicate company one's question set
        const set = await createQuestionSet(authObjects.companyOneAuthHeaders);
        const response = await request.get(`/api/v2/company/question/group/${set.id}/duplicate`, {
            headers: authObjects.companyTwoAuthHeaders
        });

        expect(response.status()).toBe(480);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have sufficient permissions.");
    });

    test("GET duplicate with candidates credentials @security", async ({ request }) => {
        // Candidates should not be able to duplicate question set
        const set = await createQuestionSet(authObjects.companyOneAuthHeaders);
        const response = await request.get(`/api/v2/company/question/group/${set.id}/duplicate`, {
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