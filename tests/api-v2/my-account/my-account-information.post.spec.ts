//POST: /api/v2/my-account/information

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/my-account/information POST requests @my-account @happy", async () => {
    test("POST with valid company credentials @happy", async ({ request }) => {
        const response = await request.post(`/api/v2/my-account/information`, {
            headers: authObjects.companyOneAuthHeaders,
            data: {
                "first_name": "Company",
                "last_name": "One",
                "email": `${process.env.COMPANY_ONE_EMAIL}`,
                "mobile_number": "01551111110",
                "provider": null,
                "can_change_password": true
            }
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.id).toBe(15283);
        expect(body.data.first_name).toBe("Company");
        expect(body.data.last_name).toBe("One");
        expect(body.data.name).toBe("Company One");
        expect(body.data.email).toBe(`${process.env.COMPANY_ONE_EMAIL}`);
        expect(body.data.status).toBe("Active");
        expect(body.data.type).toBe("employer");
        expect(body.data.companies[0].verification.status).toBe("pro");
        expect(body.data.companies[0].verification.label).toContain("This company has been verified by this");
        expect(body.message).toBe("Account information updated.");
    });

    test("POST with valid candidate credentials @happy", async ({ request }) => {
        const response = await request.post(`/api/v2/my-account/information`, {
            headers: authObjects.candidateOneAuthHeaders,
            data: {
                "first_name": "Candidate",
                "last_name": "One",
                "email": `${process.env.CANDIDATE_ONE_EMAIL}`,
                "mobile_number": "01551111110",
                "provider": null,
                "can_change_password": true
            }
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.id).toBe(15256);
        expect(body.data.first_name).toBe("Candidate");
        expect(body.data.last_name).toBe("One");
        expect(body.data.name).toBe("Candidate One");
        expect(body.data.email).toBe(`${process.env.CANDIDATE_ONE_EMAIL}`);
        expect(body.data.status).toBe("Active");
        expect(body.data.type).toBe("candidate");
        expect(body.message).toBe("Account information updated.");
    });

    test("POST with valid credentials but without contents", async ({ request }) => {
        const response = await request.post(`/api/v2/my-account/information`, {
            headers: authObjects.companyOneAuthHeaders,
        });

        expect(response.status()).toBe(422);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message.first_name).toEqual(["Please enter first name."]);
        expect(body.message.last_name).toEqual(["Please enter last name."]);
        expect(body.message.mobile_number).toEqual(["Please provide a valid phone no."]);
    });

    test("POST without auth @security", async ({ request }) => {
        const response = await request.post(`/api/v2/my-account/information`, {
            headers: {
                "Accept": "application/json",
                "Company_Id": "2227"
            },
            data: {
                "first_name": "Company",
                "last_name": "One",
                "email": `${process.env.COMPANY_ONE_EMAIL}`,
                "mobile_number": "01551111110",
                "provider": null,
                "can_change_password": true
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.message).toBe("Unauthenticated.");
    });
});