// DELETE: /api/v2/company/setting/skill/{id}

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from '@helpers/createAssertions';
import { createSkill, deleteAllSkills, deleteSkillById } from '@datafactory/skill';

test.describe("/api/v2/company/setting/skill/{id} DELETE requests @company", async () => {
    test.afterAll(async () => {
        await deleteAllSkills(authObjects.companyOneAuthHeaders);
    });

    test("DELETE with valid skill id and valid token @happy", async ({ request }) => {
        const skill = await createSkill(authObjects.companyOneAuthHeaders);
        await deleteSkillById(authObjects.companyOneAuthHeaders, skill.id);
    });

    test("DELETE with already deleted skill id", async ({ request }) => {
        // First create and delete a skill
        const skill = await createSkill(authObjects.companyOneAuthHeaders);
        await deleteSkillById(authObjects.companyOneAuthHeaders, skill.id);

        // Now try to delete the same skill again
        const response = await request.delete(`/api/v2/company/setting/skill/${skill.id}`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(499);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Skill not found.");
    });

    test("DELETE with valid skill id and invalid token", async ({ request }) => {
        const skill = await createSkill(authObjects.companyOneAuthHeaders);
        const response = await request.delete(`/api/v2/company/setting/skill/${skill.id}`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.message).toBe("Unauthenticated.");
    });

    test("DELETE with invalid int skill id and valid token", async ({ request }) => {
        const response = await request.delete(`/api/v2/company/setting/skill/123`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(499);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Skill not found.");
    });

    test("DELETE with invalid string skill id and valid token", async ({ request }) => {
        const response = await request.delete(`/api/v2/company/setting/skill/abcdef`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(499);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Skill not found.");
    });
});