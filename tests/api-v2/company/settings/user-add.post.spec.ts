//POST: /api/v2/company/setting/user/add

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { faker } from '@faker-js/faker';
import { createAssertions } from "@helpers/createAssertions";
import { deleteAllUsers } from '@datafactory/user';

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
    "role_id": user_roles.super_admin,
    "selected": ["job.view", "job.management", "job.publish", "candidate.view", "candidate.delete", "candidate.organize", "settings.company", "settings.team", "settings.pipeline", "settings.email", "settings.candidate.apply", "settings.other", "evaluation.view", "evaluation.manage.own", "evaluation.manage.all", "settings.white-label"]
};

test.describe("/api/v2/company/setting/user/add POST requests @company", async () => {
    test.beforeAll(async ({ request }) => {
        // First delete all users
        await deleteAllUsers(authObjects.companyOneAuthHeaders);
    });

    test("POST with valid credentials @happy", async ({ request }) => {
        const response = await request.post('/api/v2/company/setting/user/add', {
            headers: authObjects.companyOneAuthHeaders,
            data: data
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.id).toBeGreaterThan(1000);
        expect(body.data.name).toBeNull();
        expect(body.data.email).toBe(data.email);
        expect(body.data.roleId).toBe(data.role_id);
        expect(body.data.permissions).toEqual(data.selected);
        expect(body.data.notifications.new_candidate_applied.title).toBe("New candidate application");
        expect(body.data.notifications.new_candidate_applied.icon).toBe("e-apply");
        expect(body.data.notifications.new_candidate_applied.hint).toBe("Be informed when a candidate applies for a job post.");
        expect(body.data.notifications.candidate_pipeline_changed.title).toBe("Candidate Management");
        expect(body.data.notifications.candidate_pipeline_changed.icon).toBe("e-pipe");
        expect(body.data.notifications.candidate_pipeline_changed.hint).toBe("Be informed when a candidate is moved along the pipelines. Also when note, rating & attachments updated.");
        expect(body.data.notifications.manager_candidate_selected.title).toBe("Candidate selected");
        expect(body.data.notifications.manager_candidate_selected.icon).toBe("e-job");
        expect(body.data.notifications.manager_candidate_selected.hint).toBe("Be informed when a candidate gets selected for a job position.");
        expect(body.data.notifications.manager_candidate_rejected.title).toBe("Candidate rejected");
        expect(body.data.notifications.manager_candidate_rejected.icon).toBe("e-cancel");
        expect(body.data.notifications.manager_candidate_rejected.hint).toBe("Be informed when a candidate gets rejected.");
        expect(body.data.notifications.job_update.title).toBe("Job's update");
        expect(body.data.notifications.job_update.icon).toBe("e-credit-card");
        expect(body.data.notifications.job_update.hint).toBe("Stay informed whenever there is an update for any jobs that you are following.");
        expect(body.data.notifications.new_message_received.title).toBe("Message/conversation");
        expect(body.data.notifications.new_message_received.icon).toBe("e-mail1");
        expect(body.data.notifications.new_message_received.hint).toBe("Be informed about new messages/conversations.");
        expect(body.data.notifications.company_managers.title).toBe("Company manager");
        expect(body.data.notifications.company_managers.icon).toBe("e-users-team");
        expect(body.data.notifications.company_managers.hint).toBe("Stay informed whenever team member or manager is added/updated.");
        expect(body.data.notifications.company_settings.title).toBe("Company settings");
        expect(body.data.notifications.company_settings.icon).toBe("e-management");
        expect(body.data.notifications.company_settings.hint).toBe("Stay informed when any team member makes any change in company settings.");
        expect(body.message).toBe("Invitation link sent.");
    });

    test("POST with invalid credentials", async ({ request }) => {
        const response = await request.post('/api/v2/company/setting/user/add', {
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

        const response = await request.post('/api/v2/company/setting/user/add', {
            data: data,
            headers: maliciousHeaders
        });

        expect.soft(response.status()).toBe(400);

        expect.soft(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("POST with candidate auth", async ({ request }) => {
        const response = await request.post('/api/v2/company/setting/user/add', {
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