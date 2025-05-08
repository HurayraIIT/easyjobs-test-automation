import { expect, request } from '@playwright/test';
import { faker } from '@faker-js/faker';

export async function createNewPipeline(authHeaders: any) {
    const requestContext = await request.newContext();
    const response = await requestContext.post(`/api/v2/company/setting/pipeline`, {
        headers: authHeaders,
        data: {
            "name": `Pipeline: ${faker.hacker.noun()} ${faker.color.human()} ${faker.hacker.verb()}`,
            "steps": [
                { "label": "Applied", "type": 1, "edit": false, "isRequired": false },
                { "label": "Remote Interview", "type": 50, "edit": false },
                { "label": "Medical Screening", "type": 10, "edit": false },
                { "label": "Selected", "type": 99, "edit": false, "isRequired": false },
                { "label": "Rejected", "type": 100, "edit": false, "isRequired": false, "is_required": false }
            ]
        }
    });

    expect.soft(response.status()).toBe(200);
    const body = await response.json();
    return body.data;
}

export async function getAllPipelines(authHeaders: any) {
    const requestContext = await request.newContext();
    const response = await requestContext.get('/api/v2/company/setting/pipeline', {
        headers: authHeaders
    });

    expect.soft(response.status()).toBe(200);

    let body = await response.json();
    return body.data;
}

export async function deletePipelineById(authHeaders: any, id: number) {
    const requestContext = await request.newContext();
    const response = await requestContext.delete(`/api/v2/company/setting/pipeline/${id}/delete`, {
        headers: authHeaders
    });

    expect.soft(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("SUCCESS");
}

export async function deleteAllPipelines(authHeaders: any) {
    const pipelines = await getAllPipelines(authHeaders);
    for (let i = 1; i < pipelines.length; i++) {
        await deletePipelineById(authHeaders, pipelines.length - i);
    }
}
