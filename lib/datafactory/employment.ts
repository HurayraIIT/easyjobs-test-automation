import { expect, request } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { getRandomFromToDate } from '@helpers/date';

export async function getRandomEmploymentData() {
    let from_to_date = getRandomFromToDate();
    return {
        "id": null,
        "company_name": faker.company.name(),
        "designation": faker.person.jobTitle(),
        "department": faker.person.jobArea(),
        "from_date": from_to_date.from_date,
        "to_date": from_to_date.to_date,
        "is_currently_working": null,
        "responsibilities": faker.lorem.paragraph()
    };
}

export async function createCandidateEmployment(authHeaders: any) {
    const employment_data = await getRandomEmploymentData();

    const requestContext = await request.newContext();
    const response = await requestContext.post('/api/v2/candidate/employment', {
        data: employment_data,
        headers: authHeaders
    });

    expect.soft(response.status()).toBe(200);

    const body = await response.json();

    expect(body.status).toBe('SUCCESS');
    expect(body.message).toBe('Updated.');

    expect(body.data.user_id).toBeGreaterThan(0);
    expect(body.data.company_name).toBe(employment_data.company_name);
    expect(body.data.designation).toBe(employment_data.designation);
    expect(body.data.department).toBe(employment_data.department);
    expect(body.data.responsibilities).toBe(employment_data.responsibilities);
    expect(body.data.from).toBeTruthy();
    expect(body.data.to).toBeTruthy();
    expect(body.data.is_currently_working).toBe(false);
    expect(body.data.order).toBeGreaterThan(0);
    expect(body.data.updated_at).toBeTruthy();
    expect(body.data.created_at).toBeTruthy();
    expect(body.data.id).toBeGreaterThan(0);

    return body;
};

export async function getAllEmployments(authHeaders: any) {
    const requestContext = await request.newContext();
    const response = await requestContext.get('/api/v2/candidate/employment', {
        headers: authHeaders
    });

    expect.soft(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe('SUCCESS');
    expect(body.message).toBe(null);

    return body;
}

export async function getEmployment(authHeaders: any, employment_id: any) {
    const requestContext = await request.newContext();
    const response = await requestContext.get(`/api/v2/candidate/employment?id=${employment_id}`, {
        headers: authHeaders
    });

    expect.soft(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe('SUCCESS');
    expect(body.message).toBe(null);

    expect(body.data.id).toBe(employment_id);
    expect(body.data.designation).toBeTruthy();
    expect(body.data.company_name).toBeTruthy();
    expect(body.data.department).toBeTruthy();

    return body;
}

export async function deleteEmployment(authHeaders: any, employment_id: any) {
    const requestContext = await request.newContext();
    const response = await requestContext.delete(`/api/v2/candidate/employment/${employment_id}/delete`, {
        headers: authHeaders
    });

    expect.soft(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe('SUCCESS');
    expect(body.message).toBe('Deleted.');
}

export async function deleteAllEmployments(authHeaders: any) {
    const employments = await getAllEmployments(authHeaders);
    for (let employment of employments.data) {
        await deleteEmployment(authHeaders, employment.id);
    }
}

export async function createBulkEmployments(authHeaders: any, count: number) {
    for (let i = 0; i < count; i++) {
        await createCandidateEmployment(authHeaders);
    }
}