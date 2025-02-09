//DELETE: /api/v2/company/setting/key/${id}/delete?type=1

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createCompanySettingsKey, deleteAllCompanySettingsKeys } from '@datafactory/company-settings-key';

test.describe("/api/v2/company/setting/key/${id}/delete?type=1 DELETE requests @company", async () => {
    test.beforeEach(async ({ request }) => {
        await deleteAllCompanySettingsKeys(authObjects.companyOneAuthHeaders);
    });

    test("DELETE with valid credentials @happy", async ({ request }) => {
        const new_key = await createCompanySettingsKey(authObjects.companyOneAuthHeaders);
        const response = await request.delete(`/api/v2/company/setting/key/${new_key.id}/delete?type=1`, {
            headers: authObjects.companyOneAuthHeaders
        });

        // expect(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Key deleted.");
    });

    test("DELETE with invalid credentials", async ({ request }) => {
        const new_key = await createCompanySettingsKey(authObjects.companyOneAuthHeaders);
        const response = await request.delete(`/api/v2/company/setting/key/${new_key.id}/delete?type=1`, {
            headers: {
                "Accept": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe("Unauthenticated.");
    });

    test("DELETE with valid credentials but another company ID", async ({ request }) => {
        // Company two should not be able to modify data from company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const new_key = await createCompanySettingsKey(authObjects.companyOneAuthHeaders);
        const response = await request.delete(`/api/v2/company/setting/key/${new_key.id}/delete?type=1`, {
            headers: maliciousHeaders
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("DELETE with candidate auth @security", async ({ request }) => {
        const new_key = await createCompanySettingsKey(authObjects.companyOneAuthHeaders);
        const response = await request.delete(`/api/v2/company/setting/key/${new_key.id}/delete?type=1`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });

    test("DELETE with another company auth @security", async ({ request }) => {
        const new_key = await createCompanySettingsKey(authObjects.companyOneAuthHeaders);
        const response = await request.delete(`/api/v2/company/setting/key/${new_key.id}/delete?type=1`, {
            headers: authObjects.companyTwoAuthHeaders
        });

        expect(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });
});