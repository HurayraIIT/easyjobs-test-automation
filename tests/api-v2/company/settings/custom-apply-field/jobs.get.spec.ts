// GET: /api/v2/company/setting/custom-apply-field/jobs/{field}

import { test, expect } from "@playwright/test";
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createCustomApplyField, deleteAllCustomApplyFields, getAllCustomApplyFields } from "@datafactory/custom-fields";

test.describe("/api/v2/company/setting/custom-apply-field/jobs/{field} GET requests @company", async () => {
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

    test("GET should be able to fetch data @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/custom-apply-field/jobs/${fieldId}`, {
            headers: authObjects.companyOneAuthHeaders,
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // console.log(body);
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.message).toBe(null);
        expect(body.data.used_jobs).toBe(0);
    });

    // TODO: No security issues here, but an error should be shown instead of success
    test("GET should not be able to fetch data from another company @security", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/custom-apply-field/jobs/${fieldId}`, {
            headers: authObjects.companyTwoAuthHeaders,
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // console.log(body);
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.used_jobs).toBe(0);
        expect(body.message).toBeNull();
    });

    test("GET with invalid auth", async ({ request }) => {
        // Company two should not be able to modify data from company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.get(`/api/v2/company/setting/custom-apply-field/jobs/${fieldId}`, {
            headers: maliciousHeaders,
        });

        expect.soft(response.status()).toBe(400);

        const body = await response.json();
        // console.log(body);
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("GET should not be able to fetch data by a candidate @security", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/custom-apply-field/jobs/${fieldId}`, {
            headers: authObjects.candidateOneAuthHeaders,
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();
        // console.log(body);
        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });

    test("GET should not be able to fetch data without auth", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/custom-apply-field/jobs/${fieldId}`, {
            headers: {
                "Accept": "application/json",
            },
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        // console.log(body);
        // await createAssertions(body);
        expect(body.message).toBe("Unauthenticated.");
    });

    // TODO: Handle server errors
    test("GET with invalid id @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/custom-apply-field/jobs/1`, {
            headers: authObjects.companyOneAuthHeaders,
        });

        expect.soft(response.status()).toBe(404);

        const body = await response.json();
        // console.log(body);
        // await createAssertions(body);
    });
});
