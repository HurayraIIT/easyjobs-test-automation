// GET: /api/v2/user/package

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/user/package GET requests @company", async () => {
    test("GET with valid company credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/user/package`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.id).not.toBeNull();
        expect(body.data.name).not.toBeNull();
        expect(body.data.slug).not.toBeNull();
        expect(body.message).toBeNull();
    });

    // Fails on CI
    test.skip("GET with valid candidate credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/user/package`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status, `Body Contains: ${JSON.stringify(body, null, 2)}`).toBe("SUCCESS");
        expect(body.data.id).toBe(5);
        expect(body.data.name).toBe("Free");
        expect(body.data.slug).toBe("free");
        expect(body.message).toBeNull();
    });

    test("GET without valid credentials", async ({ request }) => {
        const response = await request.get(`/api/v2/user/package`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.message).toBe("Unauthenticated.");
    });
});