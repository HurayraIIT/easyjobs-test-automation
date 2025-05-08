//POST: /api/v2/company/setting/company-photo

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

const payload = `------geckoformboundaryf10e647705a092a2d30644a1f91fbc3c
Content-Disposition: form-data; name="file"; filename="company_logo.png"
Content-Type: image/png

asd
------geckoformboundaryf10e647705a092a2d30644a1f91fbc3c
Content - Disposition: form - data; name = "target"

company_logo
------geckoformboundaryf10e647705a092a2d30644a1f91fbc3c--
`;

test.describe("/api/v2/company/setting/company-photo POST requests @company", async () => {
    test("POST with valid credentials @happy", async ({ request }) => {
        const authHeader = authObjects.companyOneAuthHeaders;
        authHeader['Content-Type'] = "multipart / form - data; boundary = ----geckoformboundaryf10e647705a092a2d30644a1f91fbc3c";
        const response = await request.post('/api/v2/company/setting/company-photo', {
            data: payload,
            headers: authHeader
        });

        expect.soft(response.status()).toBe(422);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message.target).toEqual(["The target field is required."]);
        expect(body.message.file).toEqual(["The file field is required."]);
    });

    test("POST with candidate auth", async ({ request }) => {
        const authHeader = authObjects.candidateOneAuthHeaders;
        authHeader['Content-Type'] = "multipart / form - data; boundary = ----geckoformboundaryf10e647705a092a2d30644a1f91fbc3c";
        const response = await request.post('/api/v2/company/setting/company-photo', {
            data: payload,
            headers: authHeader
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });

    test("POST without auth", async ({ request }) => {
        const response = await request.post('/api/v2/company/setting/company-photo', {
            data: payload,
            headers: {
                "Accept": "application/json"
            }
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.message).toBe("Unauthenticated.");
    });
});