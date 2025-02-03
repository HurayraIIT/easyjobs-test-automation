// GET: /api/v2/company/question/group/{group}

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createQuestionSet, deleteAllQuestionSets, deleteQuestionSetById, getQuestionSetById } from '@datafactory/question-group';

test.describe("/api/v2/company/question/group/{group} GET requests @company", async () => {
    test("GET with valid credentials @happy", async ({ request }) => {
        const set = await createQuestionSet(authObjects.companyOneAuthHeaders);
        const question_set = await getQuestionSetById(authObjects.companyOneAuthHeaders, set.id);

        // await createAssertions(question_set);
        expect(question_set.id).toBe(set.id);
        expect(question_set.set_type.id).toBe(set.exam_type.id);
        expect(question_set.set_type.name).toBe(set.exam_type.name);
        expect(question_set.set_name).toBe(set.name);
        expect(question_set.exam_duration).toBeNull();
        expect(question_set.marks_per_question).toBeNull();

        // Delete the question set
        await deleteQuestionSetById(authObjects.companyOneAuthHeaders, set.id);
    });

    test("GET without auth token", async ({ request }) => {
        const set = await createQuestionSet(authObjects.companyOneAuthHeaders);
        const response = await request.get(`/api/v2/company/question/group/${set.id}`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');

        // Delete the question set
        await deleteQuestionSetById(authObjects.companyOneAuthHeaders, set.id);
    });

    test("GET with invalid ID but valid auth token", async ({ request }) => {
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
});