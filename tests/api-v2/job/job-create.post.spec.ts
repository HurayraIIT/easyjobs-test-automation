// POST: /api/v2/job/create

import { test, expect } from "@playwright/test";
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/job/create POST requests @company", async () => {
    test.skip("POST can create a new category@happy", async ({ request }) => {
        // Create a new job
        const response = await request.post('/api/v2/job/create', {
            headers: authObjects.companyOneAuthHeaders,
            data: {
                "category_id": 70,
                "title": "Test Job",
                "description": "This is a test job",
                "location": "Remote"
            }
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        console.log(body);
        //await createAssertions(body);
    });
});
