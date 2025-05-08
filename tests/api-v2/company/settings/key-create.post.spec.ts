//POST: /api/v2/company/setting/key/create

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { deleteAllCompanySettingsKeys } from '@datafactory/company-settings-key';

test.describe("/api/v2/company/setting/key/create POST requests @company", async () => {
    test.beforeAll(async () => {
        await deleteAllCompanySettingsKeys(authObjects.companyOneAuthHeaders);
    });

    test("POST with valid credentials @happy", async ({ request }) => {
        const response = await request.post('/api/v2/company/setting/key/create', {
            data: { "label": `Key: testname`, "type": 1 },
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.id).toBeGreaterThan(100);
        expect(body.data.label).toBe("Key: testname");
        expect(body.data.key).toBeTruthy();
        expect(body.data.type).toBe(1);
        expect(body.data.used).toBe(0);
        expect(body.data.created_at).toBeTruthy();
        expect(body.message).toBe("Key generated.");
    });

    test("POST with invalid credentials", async ({ request }) => {
        const response = await request.post('/api/v2/company/setting/key/create', {
            data: { "label": `Key: testname`, "type": 1 },
            headers: {
                "Accept": "application/json",
            }
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe("Unauthenticated.");
    });

    test("POST with valid credentials but another company ID", async ({ request }) => {
        // Company two should not be able to modify data from company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.post('/api/v2/company/setting/key/create', {
            data: { "label": `Key: testname`, "type": 1 },
            headers: maliciousHeaders
        });

        expect.soft(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("POST with candidate auth", async ({ request }) => {
        const response = await request.post('/api/v2/company/setting/key/create', {
            data: { "label": `Key: testname`, "type": 1 },
            headers: authObjects.candidateOneAuthHeaders
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });
});