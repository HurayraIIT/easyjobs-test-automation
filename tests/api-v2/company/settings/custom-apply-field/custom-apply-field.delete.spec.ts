//DELETE: /api/v2/company/setting/{fieldId}/custom-apply-field

import { faker } from '@faker-js/faker';
import authObjects from '@datafactory/auth';
import { test, expect } from '@playwright/test';
import { createAssertions } from "@helpers/createAssertions";
import { createCustomApplyField, deleteAllCustomApplyFields, getAllCustomApplyFields } from '@datafactory/custom-fields';

test.describe("/api/v2/company/setting/{fieldId}/custom-apply-field DELETE requests @company", async () => {
    let fieldId: number;

    test.beforeAll(async () => {
        await deleteAllCustomApplyFields(authObjects.companyOneAuthHeaders);

        await createCustomApplyField(authObjects.companyOneAuthHeaders, "text");
        let all_custom_fields = await getAllCustomApplyFields(authObjects.companyOneAuthHeaders);
        fieldId = all_custom_fields[0].id;
    });

    test.afterAll(async () => {
        await deleteAllCustomApplyFields(authObjects.companyOneAuthHeaders);
    });

    test("DELETE with valid credentials @happy", async ({ request }) => {
        const response = await request.delete(`/api/v2/company/setting/${fieldId}/custom-apply-field`, {
            headers: authObjects.companyOneAuthHeaders,
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Field deleted.");
    });

    test("DELETE without credentials", async ({ request }) => {
        const response = await request.delete(`/api/v2/company/setting/${fieldId}/custom-apply-field`, {
            headers: {
                "Accept": "application/json"
            },
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe("Unauthenticated.");
    });

    test("DELETE with valid credentials but another company ID", async ({ request }) => {
        // Company two should not be able to modify data from company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.delete(`/api/v2/company/setting/${fieldId}/custom-apply-field`, {
            headers: maliciousHeaders,
        });

        expect.soft(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("DELETE with candidate auth", async ({ request }) => {
        const response = await request.delete(`/api/v2/company/setting/${fieldId}/custom-apply-field`, {
            headers: authObjects.candidateOneAuthHeaders,
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });

    test("DELETE with invalid id", async ({ request }) => {
        // Can create text fields
        const response = await request.delete(`/api/v2/company/setting/123/custom-apply-field`, {
            headers: authObjects.companyOneAuthHeaders,
        });

        expect.soft(response.status()).toBe(499);

        const body = await response.json();
        // console.log(body);
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Field not exists.");
    });
});