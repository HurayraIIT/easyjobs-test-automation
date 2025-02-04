//GET: /api/v2/company/assessments/{id}

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/company/assessments/{id} GET requests @company", async () => {
    let quiz_id: any;

    test.beforeAll(async () => {
        //
    });

    test("GET with valid credentials and valid id @happy", async ({ request }) => {
        const new_assessment_id = await createAssessmentFromQuiz(authObjects.companyOneAuthHeaders, quiz_id);

        const response = await request.get(`/api/v2/company/assessments/${new_assessment_id}`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data.status).toBe('SUCCESS');
        expect(data.message).toBeNull();
        expect(data.data.id).toBe(new_assessment_id);
    });
});