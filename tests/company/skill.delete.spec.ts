// DELETE: /api/v2/company/setting/skill/{id}

import { test, expect } from '@playwright/test';
import { createAuthHeaders } from '@datafactory/auth';
import { createAssertions } from '@helpers/createAssertions';
import { createSkill, deleteAllSkills, deleteSkillById } from '@datafactory/skill';

test.describe("/api/v2/company/setting/skill/{id} DELETE requests @company", async () => {
    const companyEmail = `${process.env.COMPANY_EMAIL}`;
    const companyPassword = `${process.env.COMPANY_PASSWORD}`;

    let authHeaders: any;

    test.beforeEach(async () => {
        authHeaders = await createAuthHeaders(companyEmail, companyPassword);
    });

    test.afterAll(async () => {
        authHeaders = await createAuthHeaders(companyEmail, companyPassword);
        await deleteAllSkills(authHeaders);
    });

    test("DELETE with valid skill id and valid token @happy", async ({ request }) => {
        const skill = await createSkill(authHeaders);
        await deleteSkillById(authHeaders, skill.id);
    });

    test("DELETE with already deleted skill id", async ({ request }) => {
        // First create and delete a skill
        const skill = await createSkill(authHeaders);
        await deleteSkillById(authHeaders, skill.id);

        // Now try to delete the same skill again
        const response = await request.delete(`/api/v2/company/setting/skill/${skill.id}`, {
            headers: authHeaders
        });

        expect(response.status()).toBe(499);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Skill not found.");
    });

    test("DELETE with valid skill id and invalid token", async ({ request }) => {
        const skill = await createSkill(authHeaders);
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

    // TODO: Report Issue: Response status should be 400
    test("DELETE with invalid int skill id and valid token", async ({ request }) => {
        const response = await request.delete(`/api/v2/company/setting/skill/123`, {
            headers: authHeaders
        });

        expect(response.status()).toBe(499);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Skill not found.");
    });

    // TODO: Report Issue: Response status should be 400
    test("DELETE with invalid string skill id and valid token", async ({ request }) => {
        const response = await request.delete(`/api/v2/company/setting/skill/abcdef`, {
            headers: authHeaders
        });

        expect(response.status()).toBe(499);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Skill not found.");
    });
});