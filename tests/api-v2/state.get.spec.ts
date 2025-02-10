// GET: /api/v2/state/18

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/state/18 GET requests @company", async () => {
    test("GET with valid company credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/state/18`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body[0].group_name).toBe("Default State");
        expect(body[0].opts[0].id).toBe(337);
        expect(body[0].opts[0].name).toBe("Bagerhat");
        expect(body[0].opts[1].id).toBe(338);
        expect(body[0].opts[1].name).toBe("Bandarban");
    });

    // TODO: Report Issue
    // test("GET with valid candidate credentials @happy", async ({ request }) => {
    //     const response = await request.get(`/api/v2/state/18`, {
    //         headers: authObjects.candidateOneAuthHeaders
    //     });

    //     expect(response.status()).toBe(200);

    //     const body = await response.json();
    //     // await createAssertions(body);
    //     expect(body[0].group_name).toBe("Default State");
    //     expect(body[0].opts[0].id).toBe(337);
    //     expect(body[0].opts[0].name).toBe("Bagerhat");
    //     expect(body[0].opts[1].id).toBe(338);
    //     expect(body[0].opts[1].name).toBe("Bandarban");
    // });

    // TODO: Report Issue
    // test("GET without valid credentials @happy", async ({ request }) => {
    //     const response = await request.get(`/api/v2/state/18`, {
    //         headers: {
    //             "ACCEPT": "application/json",
    //         }
    //     });

    //     expect(response.status()).toBe(200);

    //     const body = await response.json();

    //     // await createAssertions(body);
    //     expect(body[0].group_name).toBe("Default State");
    //     expect(body[0].opts[0].id).toBe(337);
    //     expect(body[0].opts[0].name).toBe("Bagerhat");
    //     expect(body[0].opts[1].id).toBe(338);
    //     expect(body[0].opts[1].name).toBe("Bandarban");
    // });
});