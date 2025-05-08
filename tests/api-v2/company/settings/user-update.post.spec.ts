//POST: /api/v2/company/setting/user/${user.id}/update

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { faker } from '@faker-js/faker';
import { createAssertions } from "@helpers/createAssertions";
import { createNewUser, deleteAllUsers } from '@datafactory/user';

const user_roles = {
    "super_admin": 1,
    "administrator": 2,
    "hr_manager": 3,
    "operator": 4,
    "reviewer": 5,
    "team_leader": 7,
};

const data = {
    "email": `${faker.internet.email({ provider: "wpdeveloper.com" })}`,
    "role_id": user_roles.team_leader,
    "selected": ["job.view", "candidate.view", "candidate.organize", "candidate.delete"]
};

test.describe("/api/v2/company/setting/user/${user.id}/update POST requests @company", async () => {
    let user: any;
    test.beforeAll(async ({ request }) => {
        // First delete all users
        await deleteAllUsers(authObjects.companyOneAuthHeaders);
        user = await createNewUser(authObjects.companyOneAuthHeaders);
    });

    test("POST with valid credentials @happy", async ({ request }) => {
        const response = await request.post(`/api/v2/company/setting/user/${user.id}/update`, {
            headers: authObjects.companyOneAuthHeaders,
            data: data
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.manager.id).toBeGreaterThan(1000);
        expect(body.data.manager.name).toBeNull();
        expect(body.data.manager.profile_image).toBe("https://app.easyjobs.dev/assets/images/avatar.png");
        expect(body.data.manager.email).not.toBe(data.email);
        expect(body.data.manager.roleId).toBe(data.role_id);
        expect(body.data.manager.role).toBe("Team Leader");
        expect(body.data.manager.permissions).toEqual(data.selected);
        expect(body.data.manager.notifications.new_candidate_applied.title).toBe("New candidate application");
        expect(body.data.manager.notifications.new_candidate_applied.icon).toBe("e-apply");
        expect(body.data.manager.notifications.new_candidate_applied.hint).toBe("Be informed when a candidate applies for a job post.");
        expect(body.data.manager.notifications.candidate_pipeline_changed.title).toBe("Candidate Management");
        expect(body.data.manager.notifications.candidate_pipeline_changed.icon).toBe("e-pipe");
        expect(body.data.manager.notifications.candidate_pipeline_changed.hint).toBe("Be informed when a candidate is moved along the pipelines. Also when note, rating & attachments updated.");
        expect(body.data.manager.notifications.manager_candidate_selected.title).toBe("Candidate selected");
        expect(body.data.manager.notifications.manager_candidate_selected.icon).toBe("e-job");
        expect(body.data.manager.notifications.manager_candidate_selected.hint).toBe("Be informed when a candidate gets selected for a job position.");
        expect(body.data.manager.notifications.manager_candidate_rejected.title).toBe("Candidate rejected");
        expect(body.data.manager.notifications.manager_candidate_rejected.icon).toBe("e-cancel");
        expect(body.data.manager.notifications.manager_candidate_rejected.hint).toBe("Be informed when a candidate gets rejected.");
        expect(body.data.manager.notifications.new_message_received.title).toBe("Message/conversation");
        expect(body.data.manager.notifications.new_message_received.icon).toBe("e-mail1");
        expect(body.data.manager.notifications.new_message_received.hint).toBe("Be informed about new messages/conversations.");
        expect(body.data.user).toEqual([]);
        expect(body.message).toBe("User updated!");
    });

    test("POST with invalid credentials", async ({ request }) => {
        const response = await request.post(`/api/v2/company/setting/user/${user.id}/update`, {
            headers: {
                "Accept": "application/json",
            },
            data: data
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe("Unauthenticated.");
    });

    test("POST with valid credentials but another company ID", async ({ request }) => {
        // Company two should not be able to modify data from company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.post(`/api/v2/company/setting/user/${user.id}/update`, {
            data: data,
            headers: maliciousHeaders
        });

        expect.soft(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("POST with candidate auth", async ({ request }) => {
        const response = await request.post(`/api/v2/company/setting/user/${user.id}/update`, {
            data: data,
            headers: authObjects.candidateOneAuthHeaders
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });
});