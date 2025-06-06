// GET: /api/v2/company/setting/skill

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createSkill, deleteAllSkills, deleteSkillById, getAllSkills } from '@datafactory/skill';

test.describe("/api/v2/company/setting/skill GET requests @company", async () => {
    test("GET with valid credentials @happy", async ({ request }) => {
        const new_skill = await createSkill(authObjects.companyOneAuthHeaders);
        let all_skills = await getAllSkills(authObjects.companyOneAuthHeaders);
        let flag = 0;
        for (let skill of all_skills) {
            if (skill.id === new_skill.id) {
                flag = 1;
                // await createAssertions(skill);
                expect(skill.name).toBe(new_skill.name);
                expect(skill.slug).toBe(new_skill.name.replace(/\s+/g, "-").toLowerCase());
                expect(skill.company_id).toBeGreaterThan(0);
                expect(skill.use_count).toBeGreaterThanOrEqual(0);
            }
        }
        expect(flag).toBe(1);
        await deleteSkillById(authObjects.companyOneAuthHeaders, new_skill.id);
    });

    test("GET without auth token", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/skill`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });
});