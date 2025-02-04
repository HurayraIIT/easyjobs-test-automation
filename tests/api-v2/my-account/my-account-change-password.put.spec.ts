//PUT: /api/v2/my-account/change-password

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/my-account/change-password PUT requests @my-account", async () => {
    test("PUT with valid company credentials @happy", async ({ request }) => {
        const response = await request.put(`/api/v2/my-account/change-password`, {
            headers: authObjects.companyOneAuthHeaders,
            data: {
                "old_password": `${process.env.PASSWORD}`,
                "new_password": `${process.env.PASSWORD}`,
                "confirm_password": `${process.env.PASSWORD}`
            }
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.message).toBe("Password change.");
    });

    test("PUT with valid credentials but wrong old password passwords", async ({ request }) => {
        const response = await request.put(`/api/v2/my-account/change-password`, {
            headers: authObjects.companyOneAuthHeaders,
            data: {
                "old_password": `12345678`,
                "new_password": "new_password",
                "confirm_password": "new_password"
            }
        });

        expect(response.status()).toBe(422);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message.old_password).toEqual(["Wrong current password."]);
    });

    test("PUT with valid credentials but empty passwords", async ({ request }) => {
        const response = await request.put(`/api/v2/my-account/change-password`, {
            headers: authObjects.companyOneAuthHeaders,
            data: {
                "old_password": "",
                "new_password": "",
                "confirm_password": ""
            }
        });

        expect(response.status()).toBe(422);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message.old_password).toEqual(["Please enter current password."]);
        expect(body.message.new_password).toEqual(["Please enter new password."]);
        expect(body.message.confirm_password).toEqual(["Please enter confirm password."]);
    });

    test("PUT with valid credentials but mismatched passwords", async ({ request }) => {
        const response = await request.put(`/api/v2/my-account/change-password`, {
            headers: authObjects.companyOneAuthHeaders,
            data: {
                "old_password": `${process.env.PASSWORD}`,
                "new_password": "firsttest",
                "confirm_password": "secondtest"
            }
        });

        expect(response.status()).toBe(422);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message.confirm_password).toEqual(["Passwords did not match."]);
    });

    test("PUT with another company ID @security", async ({ request }) => {
        // Company two should not be able to update company one password
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.put(`/api/v2/my-account/change-password`, {
            headers: maliciousHeaders,
            data: {
                "old_password": `${process.env.PASSWORD}`,
                "new_password": `${process.env.PASSWORD}`,
                "confirm_password": `${process.env.PASSWORD}`
            }
        });

        expect(response.status()).toBe(471);

        const data = await response.json();
        // await createAssertions(data);
        expect(data.status).toBe("FAILED");
        expect(data.data).toEqual([]);
        expect(data.message).toBe("Something went wrong.");
    });

    test("PUT without auth", async ({ request }) => {
        const response = await request.put(`/api/v2/my-account/change-password`, {
            headers: {
                "Accept": "application/json",
                "Company_Id": "2227"
            },
            data: {
                "old_password": `${process.env.PASSWORD}`,
                "new_password": `${process.env.PASSWORD}`,
                "confirm_password": `${process.env.PASSWORD}`
            }
        });

        expect(response.status()).toBe(401);

        const data = await response.json();
        // await createAssertions(data);
        expect(data.message).toBe("Unauthenticated.");
    });

    test("PUT with valid candidate credentials @happy", async ({ request }) => {
        const response = await request.put(`/api/v2/my-account/change-password`, {
            headers: authObjects.candidateOneAuthHeaders,
            data: {
                "old_password": `${process.env.PASSWORD}`,
                "new_password": `${process.env.PASSWORD}`,
                "confirm_password": `${process.env.PASSWORD}`
            }
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.message).toBe("Password change.");
    });
});