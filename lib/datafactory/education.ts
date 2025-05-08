import { expect, request } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { getRandomYear } from '@helpers/date';
import { createAssertions } from '@helpers/createAssertions';
import { degree, education_level } from '../helpers/static-data';

export function getRandomEducationData() {
    const level = education_level;
    const degree_data = degree;
    const passing_year = `${getRandomYear()}`;
    const academy_name = `${faker.company.name()} Academy 🇧🇩 🇵🇸`;
    return {
        "id": null,
        "level": level.name,
        "degree": degree_data.name,
        "passing_year": passing_year,
        "academy_name": academy_name
    };
}

export async function createEducation(authHeaders: any) {
    const education_data = getRandomEducationData();

    const requestContext = await request.newContext();
    const response = await requestContext.post('/api/v2/candidate/education', {
        data: education_data,
        headers: authHeaders
    });
    expect.soft(response.status()).toBe(200);
    const body = await response.json();
    return body;
}

export async function getAllEducations(authHeaders: any) {
    const requestContext = await request.newContext();
    const response = await requestContext.get('/api/v2/candidate/education', {
        headers: authHeaders
    });

    expect.soft(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe('SUCCESS');
    expect(body.message).toBe(null);

    return body;
}

export async function getEducationById(authHeaders: any, education_id: any) {
    const requestContext = await request.newContext();
    const response = await requestContext.get(`/api/v2/candidate/education?id=${education_id}`, {
        headers: authHeaders
    });

    expect.soft(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe('SUCCESS');
    expect(body.message).toBe(null);

    // await createAssertions(body);
    expect(body.data.id).toBe(education_id);
    expect(body.data.level).toBeTruthy();
    expect(body.data.degree).toBeTruthy();
    expect(body.data.passing_year).toBeGreaterThan(0);
    expect(body.data.academy_name).toBeTruthy();

    return body;
}

export async function deleteEducationById(authHeaders: any, education_id: any) {
    const requestContext = await request.newContext();
    const response = await requestContext.delete(`/api/v2/candidate/education/${education_id}/delete`, {
        headers: authHeaders
    });

    expect.soft(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe('SUCCESS');
    expect(body.message).toBe('Deleted.');
}

export async function deleteAllEducations(authHeaders: any) {
    const educations = await getAllEducations(authHeaders);
    for (let education of educations.data) {
        await deleteEducationById(authHeaders, education.id);
    }
}

export async function createBulkEducations(authHeaders: any, count: number) {
    for (let i = 0; i < count; i++) {
        await createEducation(authHeaders);
    }
}