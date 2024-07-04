import { expect, request } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { getRandomYear } from '@helpers/date';
import { createAssertions } from '@helpers/createAssertions';

export async function getRandomEducationData() {
    const level = await getRandomEducationLevel();
    const degree = await getRandomDegreeTitle();
    const passing_year = `${getRandomYear()}`;
    const academy_name = `${faker.company.name()} Academy 🇧🇩 🇵🇸`;
    return {
        "id": null,
        "level": level.name,
        "degree": degree.name,
        "passing_year": passing_year,
        "academy_name": academy_name
    };
}

export async function getRandomEducationLevel() {
    const requestContext = await request.newContext();
    const response = await requestContext.get('/api/v2/education-level?keyword=');

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.length).toBeGreaterThan(0);

    const random_index = Math.floor(Math.random() * body.length);
    expect(body[random_index].id).toBeGreaterThan(0);

    return body[random_index];
}

export async function getRandomDegreeTitle() {
    const requestContext = await request.newContext();
    const response = await requestContext.get('/api/v2/degree?keyword=');

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.length).toBeGreaterThan(0);

    const random_index = Math.floor(Math.random() * body.length);
    expect(body[random_index].id).toBeGreaterThan(0);

    return body[random_index];
}

export async function createEducation(authHeaders: any) {
    const education_data = await getRandomEducationData();

    const requestContext = await request.newContext();
    const response = await requestContext.post('/api/v2/candidate/education', {
        data: education_data,
        headers: authHeaders
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.status).toBe('SUCCESS');
    expect(body.message).toBe('Updated.');

    //await createAssertions(body);
    expect(body.data.user_id).toBeGreaterThan(0);
    expect(body.data.level).toBe(education_data.level);
    expect(body.data.degree).toBe(education_data.degree);
    expect(body.data.academy_name).toBe(education_data.academy_name);
    expect(body.data.passing_year).toBe(education_data.passing_year);
    expect(body.data.level_id).toBeGreaterThan(0);
    expect(body.data.degree_id).toBeGreaterThan(0);
    expect(body.data.order).toBeGreaterThan(0);
    expect(body.data.id).toBeGreaterThan(0);

    return body;
}

export async function getAllEducations(authHeaders: any) {
    const requestContext = await request.newContext();
    const response = await requestContext.get('/api/v2/candidate/education', {
        headers: authHeaders
    });

    expect(response.status()).toBe(200);

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

    expect(response.status()).toBe(200);

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

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe('SUCCESS');
    expect(body.message).toBe('Deleted.');
}

export async function deleteAllEducations(authHeaders: any) {
    const educations = await getAllEducations(authHeaders);
    for (let education of educations.data) {
        await deleteEducationById(authHeaders, education.id);
    }

    const remaining_educations = await getAllEducations(authHeaders);
    expect(remaining_educations.data).toHaveLength(0);
}

export async function createBulkEducations(authHeaders: any, count: number) {
    for (let i = 0; i < count; i++) {
        await createEducation(authHeaders);
    }
}