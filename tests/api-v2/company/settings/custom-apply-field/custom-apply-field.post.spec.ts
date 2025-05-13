//POST: /api/v2/company/setting/custom-apply-field

import { faker } from '@faker-js/faker';
import authObjects from '@datafactory/auth';
import { test, expect } from '@playwright/test';
import { createAssertions } from "@helpers/createAssertions";
import { deleteAllCustomApplyFields } from '@datafactory/custom-fields';

test.describe("/api/v2/company/setting/custom-apply-field POST requests @company", async () => {
    let text_field_data: any = null;
    let file_field_data: any = null;

    test.beforeAll(async () => {
        text_field_data = {
            "custom_fields": {
                "id": null,
                "type": "text",
                "field_name": `Custom Field Text ${new Date().getTime()}`,
                "allowed_types": [],
                "active": true
            }
        };

        file_field_data = {
            "custom_fields": {
                "id": null,
                "type": "file",
                "field_name": `Custom Field File ${new Date().getTime()}`,
                "allowed_types": ["pdf", "doc", "xls", "ppt", "jpg", "jpeg", "png", "svg", "gif", "mp3", "mp4", "zip"],
                "active": true
            }
        };
    });

    test.afterAll( async () => {
        await deleteAllCustomApplyFields(authObjects.companyOneAuthHeaders);
    });

    test("POST with valid credentials @happy", async ({ request }) => {
        // Can create text fields
        const response = await request.post(`/api/v2/company/setting/custom-apply-field`, {
            headers: authObjects.companyOneAuthHeaders,
            data: text_field_data
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Custom apply field updated.");

        // Can create file fields
        const response2 = await request.post(`/api/v2/company/setting/custom-apply-field`, {
            headers: authObjects.companyOneAuthHeaders,
            data: file_field_data
        });

        expect(response.status()).toBe(200);

        const body2 = await response2.json();
        // await createAssertions(body2);
        expect(body2.status).toBe("SUCCESS");
        expect(body2.data).toEqual([]);
        expect(body2.message).toBe("Custom apply field updated.");
    });

    test("POST without credentials", async ({ request }) => {
        const response = await request.post(`/api/v2/company/setting/custom-apply-field`, {
            headers: {
                "Accept": "application/json"
            },
            data: text_field_data
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

        const response = await request.post(`/api/v2/company/setting/custom-apply-field`, {
            headers: maliciousHeaders,
            data: text_field_data
        });

        expect.soft(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("POST with candidate auth", async ({ request }) => {
        const response = await request.post(`/api/v2/company/setting/custom-apply-field`, {
            headers: authObjects.candidateOneAuthHeaders,
            data: text_field_data
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });

    test("POST with empty data", async ({ request }) => {
        // Can create text fields
        const response = await request.post(`/api/v2/company/setting/custom-apply-field`, {
            headers: authObjects.companyOneAuthHeaders,
            data: {}
        });

        expect(response.status()).toBe(422);

        const body = await response.json();
        // console.log(body);
        // await createAssertions(body);
        expect(body.message).toBe("The custom fields.field name field is required.");
        expect(body.errors['custom_fields.field_name']).toEqual(["The custom fields.field name field is required."]);
    });
});