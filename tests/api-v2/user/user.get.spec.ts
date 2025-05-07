// GET: /api/v2/user

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/user GET requests @company", async () => {
    test("GET with valid company credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/user`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.message).toBeNull();
        expect(body.data.domain_company.admin_favicon).toBe("/favicon.png");
        expect(body.data.domain_company.sidebar_color).toBe("#597dfc");
        expect(body.data.domain_company.id).toBeNull();
        expect(body.data.domain_company.name).toBe("easy.jobs");
        expect(body.data.first_name).toBe("Company");
        expect(body.data.last_name).toBe("One");
        expect(body.data.name).toBe("Company One");
        expect(body.data.status).toBe("Active");
        expect(body.data.dob).toBeNull();
    });

    test("GET with valid candidate credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/user`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.first_name).toBe("Candidate");
        expect(body.data.last_name).toBe("One");
        expect(body.data.name).toBe("Candidate One");
        expect(body.data.status).toBe("Active");
        expect(body.data.dob).toBeNull();
        expect(body.data.gender).toBe("---");
        expect(body.data.current_company).toBeNull();
        expect(body.message).toBeNull();
    });

    test("GET without valid credentials", async ({ request }) => {
        const response = await request.get(`/api/v2/user`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect(response.status()).toBe(401);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.message).toBe("Unauthenticated.");
    });
});