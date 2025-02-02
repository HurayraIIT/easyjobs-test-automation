// POST: /api/v2/company/setting/skill/save

import { test, expect } from "@playwright/test";
import { createAuthHeaders } from "@datafactory/auth";
import { createAssertions } from "@helpers/createAssertions";
import { deleteSkillById, getRandomSkillData } from "@datafactory/skill";

test.describe("/api/v2/company/setting/skill/save POST requests @company", async () => {
    const companyEmail = `${process.env.COMPANY_EMAIL}`;
    const companyPassword = `${process.env.COMPANY_PASSWORD}`;

    let authHeaders: any;

    test.beforeEach(async () => {
        authHeaders = await createAuthHeaders(companyEmail, companyPassword);
    });

    test("POST can create a new skill and edit it @happy", async ({ request }) => {
        // Create a new skill
        let skill_data = await getRandomSkillData();
        const response = await request.post('/api/v2/company/setting/skill/save', {
            data: skill_data,
            headers: authHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        //await createAssertions(body);
        expect(body.status).toBe("SUCCESS");

        // Edit the skill
        let new_skill_data = await getRandomSkillData();
        new_skill_data.id = body.data.id;
        const new_response = await request.post('/api/v2/company/setting/skill/save', {
            data: new_skill_data,
            headers: authHeaders
        });

        expect(new_response.status()).toBe(200);

        const new_body = await new_response.json();

        //await createAssertions(new_body);
        expect(new_body.status).toBe("SUCCESS");
        expect(new_body.data.id).toBe(body.data.id);
        expect(new_body.data.name).toBe(new_skill_data.name);
        expect(new_body.data.slug).toBe(new_skill_data.name.replace(/\s+/g, "-").toLowerCase());
        expect(new_body.data.company_id).toBeGreaterThan(0);
        expect(new_body.message).toBe("Skill updated.");

        // Delete the skill
        await deleteSkillById(authHeaders, new_body.data.id);
    });

    test("POST with empty data", async ({ request }) => {
        const response = await request.post('/api/v2/company/setting/skill/save', {
            data: {},
            headers: authHeaders
        });

        expect(response.status()).toBe(422);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message.name).toEqual(["The name field is required."]);
    });

    test("POST with no data", async ({ request }) => {
        const response = await request.post('/api/v2/company/setting/skill/save', {
            headers: authHeaders
        });

        expect(response.status()).toBe(422);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message.name).toEqual(["The name field is required."]);
    });

    test("POST with valid data but no auth", async ({ request }) => {
        // Create a new skill
        let skill_data = await getRandomSkillData();
        const response = await request.post('/api/v2/company/setting/skill/save', {
            data: skill_data,
            headers: {
                "Accept": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();

        //await createAssertions(body);
        expect(body.message).toBe('Unauthenticated.');
    });

    test("POST with invalid id", async ({ request }) => {
        // Create a new skill
        let skill_data = await getRandomSkillData();
        const response = await request.post('/api/v2/company/setting/skill/save', {
            data: {
                ...skill_data,
                id: 123
            },
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
