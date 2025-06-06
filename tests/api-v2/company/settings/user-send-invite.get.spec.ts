//GET: /api/v2/company/setting/user/${user.id}/send-invitation/{jobPostId?}

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";
import { createNewUser, deleteAllUsers } from '@datafactory/user';

test.describe("/api/v2/company/setting/user/${user.id}/send-invitation/{jobPostId?} GET requests @company", async () => {
    let user: any;

    test.beforeAll(async ({ request }) => {
        // First delete all users
        await deleteAllUsers(authObjects.companyOneAuthHeaders);
        user = await createNewUser(authObjects.companyOneAuthHeaders);
    });

    test("GET with valid credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/user/${user.id}/send-invitation`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Invitation link sent.");
    });

    test("GET with invalid credentials", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/user/${user.id}/send-invitation`, {
            headers: {
                "Accept": "application/json",
            }
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe("Unauthenticated.");
    });

    test("GET with valid credentials but another company ID @security", async ({ request }) => {
        // Company two should not be able to access data from company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.get(`/api/v2/company/setting/user/${user.id}/send-invitation`, {
            headers: maliciousHeaders
        });

        expect.soft(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("GET with candidate auth", async ({ request }) => {
        const response = await request.get(`/api/v2/company/setting/user/${user.id}/send-invitation`, {
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