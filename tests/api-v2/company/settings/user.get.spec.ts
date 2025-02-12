//GET: /api/v2/company/setting/user

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { deleteAllUsers } from '@datafactory/user';

test.describe("/api/v2/company/setting/user GET requests @company", async () => {
    test("GET with valid credentials @happy", async ({ request }) => {
        await deleteAllUsers(authObjects.companyOneAuthHeaders);

        const response = await request.get(`/api/v2/company/setting/user`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data[0].id).toBe(15283);
        expect(body.data[0].name).toBe(`Company One<span class="user-indicator"> (You)</span>`);
        expect(body.data[0].profile_image).toBe("https://app.easyjobs.dev/storage/8056/image-01.png");
        expect(body.data[0].email).toBe(`${process.env.COMPANY_ONE_EMAIL}`);
        expect(body.data[0].roleId).toBe(2);
        expect(body.data[0].role).toBe("Administrator");
        expect(body.data[0].permissions).toEqual(["job.view", "job.management", "job.publish", "candidate.view", "candidate.delete", "candidate.organize", "settings.company", "settings.team", "settings.pipeline", "settings.email", "settings.candidate.apply", "settings.white-label", "settings.other", "evaluation.view", "evaluation.manage.own", "evaluation.manage.all"]);
        expect(body.data[0].status).toBe(1);
        expect(body.message).toBeNull();
    });

    test("GET with invalid credentials", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/user`, {
            headers: {
                "Accept": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe("Unauthenticated.");
    });

    test("GET with valid credentials but another company ID @security", async ({ request }) => {
        // Company two should not be able to access data from company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.get(`/api/v2/company/setting/user`, {
            headers: maliciousHeaders
        });

        expect(response.status()).toBe(471);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("GET with candidate auth", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/user`, {
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