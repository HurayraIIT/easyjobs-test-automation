import { expect, request } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { createAssertions } from '@helpers/createAssertions';

/**
 * Generates random skill data.
 * @returns A promise that resolves to an object containing the generated skill data.
 */
export async function getRandomSkillData(): Promise<{ id: any; name: string; }> {
    const name = `${faker.commerce.department()} ${new Date().getTime()}`;
    return {
        "id": null,
        "name": name
    };
}

export async function createSkill(authHeaders: any) {
    const skill_data = await getRandomSkillData();

    const requestContext = await request.newContext();
    const response = await requestContext.post('/api/v2/company/setting/skill/save', {
        data: skill_data,
        headers: authHeaders
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    // await createAssertions(body);
    expect(body.status).toBe("SUCCESS");
    expect(body.data.id).toBeGreaterThan(0);
    expect(body.data.name).toBe(skill_data.name);
    expect(body.data.slug).toBe(skill_data.name.replace(/\s+/g, "-").toLowerCase());
    expect(body.data.company_id).toBeGreaterThan(0);
    expect(body.message).toBe("Skill added.");

    return body.data;
}

export async function getAllSkills(authHeaders: any) {
    let all_skills: any;
    const requestContext = await request.newContext();
    const response = await requestContext.get('/api/v2/company/setting/skill?page=1', {
        headers: authHeaders
    });

    expect(response.status()).toBe(200);

    let body = await response.json();
    all_skills = body.data.data;
    let total_skills = body.data.total;

    for (let current_page = 2; current_page <= body.data.last_page; current_page++) {
        const response = await requestContext.get(`/api/v2/company/setting/skill?page=${current_page}`, {
            headers: authHeaders
        });
        expect(response.status()).toBe(200);
        let body2 = await response.json();
        all_skills = all_skills.concat(body2.data.data);
    }

    expect(all_skills.length).toBe(total_skills);
    return all_skills;
}

export async function deleteSkillById(authHeaders: any, id: number) {
    const requestContext = await request.newContext();
    const response = await requestContext.delete(`/api/v2/company/setting/skill/${id}`, {
        headers: authHeaders
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    // await createAssertions(body);
    expect(body.status).toBe("SUCCESS");
    expect(body.data.id).toBe(id);
    expect(body.data.name).toBeTruthy();
    expect(body.data.slug).toBe(body.data.name.replace(/\s+/g, "-").toLowerCase());
    expect(body.data.company_id).toBeGreaterThan(0);
    expect(body.message).toBe("Skill deleted.");
}

/**
 * Deletes all skills.
 * @param authHeaders - The authentication headers.
 * @returns A Promise that resolves when all skills are deleted.
 */
export async function deleteAllSkills(authHeaders: any): Promise<void> {
    const skills = await getAllSkills(authHeaders);
    for (let skill of skills) {
        await deleteSkillById(authHeaders, skill.id);
    }
}

/**
 * Creates multiple skills in bulk.
 * 
 * @param authHeaders - The authentication headers.
 * @param count - The number of skills to create.
 * @returns A Promise that resolves when all skills are created.
 */
export async function createBulkSkills(authHeaders: any, count: number): Promise<void> {
    let skill: any;
    for (let i = 0; i < count; i++) {
        skill = await createSkill(authHeaders);
        expect(skill.id).toBeGreaterThan(0);
    }
}