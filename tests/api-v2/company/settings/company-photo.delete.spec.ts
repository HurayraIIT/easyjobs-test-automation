//DELETE: /api/v2/company/setting/company-photo

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

const data = {"_method":"DELETE","target":"company_logo","order":null};

test.describe("/api/v2/company/setting/company-photo DELETE requests @company", async () => {
    test("DELETE with valid credentials @happy", async ({ request }) => {
        const response = await request.delete('/api/v2/company/setting/company-photo', {
            data: data,
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Sorry, Media not found.");
    });

    test("DELETE with candidate auth", async ({ request }) => {
        const response = await request.delete('/api/v2/company/setting/company-photo', {
            data: data,
            headers: authObjects.candidateOneAuthHeaders
        });

        expect(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });

    test("DELETE without auth", async ({ request }) => {
        const response = await request.delete('/api/v2/company/setting/company-photo', {
            data: data,
            headers: {
                "Accept": "application/json"
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.message).toBe("Unauthenticated.");
    });
});