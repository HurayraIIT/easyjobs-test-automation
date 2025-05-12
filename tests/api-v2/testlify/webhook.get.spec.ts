// GET: /api/v2/testlify/webhook

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/testlify/webhook GET requests @company", async () => {
    test("GET with valid company credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/testlify/webhook`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.id).toBe(5);
        expect(body.data.job_applicant_id).toBe(4963);
        expect(body.data.company_id).toBe(1536);
        expect(body.data.type).toBe(10);
        expect(body.data.meta).toBeNull();
        expect(body.data.created_at).not.toBeNull();
        expect(body.data.updated_at).not.toBeNull();
        expect(body.message).toBe("Successfully Candidate Assigned Assessment Status.");
    });

    test("GET with valid candidate credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/testlify/webhook`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data.id).toBe(5);
        expect(body.data.job_applicant_id).toBe(4963);
        expect(body.data.company_id).toBe(1536);
        expect(body.data.type).toBe(10);
        expect(body.data.meta).toBeNull();
        expect(body.data.created_at).not.toBeNull();
        expect(body.data.updated_at).not.toBeNull();
        expect(body.message).toBe("Successfully Candidate Assigned Assessment Status.");
    });

    test("GET with invalid credentials", async ({ request }) => {
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.get(`/api/v2/testlify/webhook`, {
            headers: maliciousHeaders
        });

        expect.soft(response.status()).toBe(471);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("GET without valid credentials", async ({ request }) => {
        const response = await request.get(`/api/v2/testlify/webhook`, {
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