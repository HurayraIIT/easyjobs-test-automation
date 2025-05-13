// GET: /api/v2/company/setting/custom-apply-field

import { test, expect } from "@playwright/test";
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createCustomApplyField, deleteAllCustomApplyFields } from "@datafactory/custom-fields";

test.describe("/api/v2/company/setting/custom-apply-field GET requests @company", async () => {
    test.beforeAll(async () => {
        await deleteAllCustomApplyFields(authObjects.companyOneAuthHeaders);
        await createCustomApplyField(authObjects.companyOneAuthHeaders, "text");
        await createCustomApplyField(authObjects.companyOneAuthHeaders, "file");
    });

    test.afterAll(async () => {
        await deleteAllCustomApplyFields(authObjects.companyOneAuthHeaders);
    });

    test("GET should be able to fetch data @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/custom-apply-field`, {
            headers: authObjects.companyOneAuthHeaders,
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // console.log(body.data.custom_fields);
        // await createAssertions(body.data.custom_fields[1].meta);
        expect(body.status).toBe("SUCCESS");
        expect(body.message).toBe(null);
        expect(body.data.custom_fields.length).toBe(2);

        // First One Should Be Text
        expect(body.data.custom_fields[0].id).toBeGreaterThan(100);
        expect(body.data.custom_fields[0].company_id).toBe(parseInt(authObjects.companyOneAuthHeaders["Company-Id"]));
        expect(body.data.custom_fields[0].type).toBe("text");
        expect(body.data.custom_fields[0].active).toBe(true);
        expect(body.data.custom_fields[0].title).toContain("text");
        expect(body.data.custom_fields[0].field_name).toContain("text");
        expect(body.data.custom_fields[0].meta).toBeNull();
        expect(body.data.custom_fields[0].created_at).not.toBe(null);
        expect(body.data.custom_fields[0].updated_at).not.toBe(null);

        // Second One Should Be File
        expect(body.data.custom_fields[1].id).toBeGreaterThan(100);
        expect(body.data.custom_fields[1].company_id).toBe(parseInt(authObjects.companyOneAuthHeaders["Company-Id"]));
        expect(body.data.custom_fields[1].type).toBe("file");
        expect(body.data.custom_fields[1].active).toBe(true);
        expect(body.data.custom_fields[1].title).toContain("file");
        expect(body.data.custom_fields[1].field_name).toContain("file");
        expect(body.data.custom_fields[1].meta.allowed_types).toEqual(["pdf", "doc", "xls", "ppt", "jpg", "jpeg", "png", "svg", "gif", "mp3", "mp4", "zip"]);
        expect(body.data.custom_fields[1].created_at).not.toBe(null);
        expect(body.data.custom_fields[1].updated_at).not.toBe(null);
    });

    test("GET should not be able to fetch data from another company @security", async ({ request }) => {
        // Company two should not be able to modify data from company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.get(`/api/v2/company/setting/custom-apply-field`, {
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
        const response = await request.get(`/api/v2/company/setting/custom-apply-field`, {
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
        const response = await request.get(`/api/v2/company/setting/custom-apply-field`, {
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
});
