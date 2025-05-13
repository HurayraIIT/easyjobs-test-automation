import { expect, request } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { createAssertions } from '@helpers/createAssertions';

export async function createCustomApplyField(authHeaders: any, field_type: string = "text") {
    // field_type can be "text" or "file"
    let field_name = `Custom Field ${field_type} ${faker.science.chemicalElement().name}`;
    let data = {
        "custom_fields": {
            "id": null,
            "type": field_type,
            "field_name": field_name,
            "allowed_types": (field_type === "file") ? ["pdf", "doc", "xls", "ppt", "jpg", "jpeg", "png", "svg", "gif", "mp3", "mp4", "zip"] : [],
            "active": true
        }
    };

    const requestContext = await request.newContext();
    const response = await requestContext.post(`/api/v2/company/setting/custom-apply-field`, {
        headers: authHeaders,
        data: data
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    // await createAssertions(body);
    expect(body.status).toBe("SUCCESS");
    expect(body.message).toBe("Custom apply field updated.");
}

export async function getAllCustomApplyFields(authHeaders: any) {
    const requestContext = await request.newContext();
    const response = await requestContext.get(`/api/v2/company/setting/custom-apply-field`, {
        headers: authHeaders
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    // await createAssertions(body);
    expect(body.status).toBe("SUCCESS");
    return body.data.custom_fields;
    // {"status":"SUCCESS","data":{"custom_fields":[{"id":751,"company_id":2239,"type":"text","active":true,"title":"Custom Field Text","field_name":"751_custom_field_text","meta":null,"created_at":"2025-05-13T08:54:10.000000Z","updated_at":"2025-05-13T08:54:10.000000Z"},{"id":752,"company_id":2239,"type":"file","active":true,"title":"Custom Field File","field_name":"752_custom_field_file","meta":{"allowed_types":["pdf","doc","xls","ppt","jpg","jpeg","png","svg","gif","mp3","mp4","zip"]},"created_at":"2025-05-13T08:56:06.000000Z","updated_at":"2025-05-13T08:56:06.000000Z"}]},"message":null}
}

export async function deleteCustomApplyFieldById(authHeaders: any, field_id: number) {
    const requestContext = await request.newContext();
    const response = await requestContext.delete(`/api/v2/company/setting/${field_id}/custom-apply-field`, {
        headers: authHeaders
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    // await createAssertions(body);
    expect(body.status).toBe("SUCCESS");
    expect(body.message).toBe("Field deleted.");
}

export async function deleteAllCustomApplyFields(authHeaders: any) {
    const customFields = await getAllCustomApplyFields(authHeaders);
    for (const field of customFields) {
        await deleteCustomApplyFieldById(authHeaders, field.id);
    }
}