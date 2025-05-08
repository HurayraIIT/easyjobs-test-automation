// DELETE: /api/v2/candidate/education/{education}/delete

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createEducation, deleteAllEducations } from '@datafactory/education';
import { createAssertions } from '@helpers/createAssertions';

test.describe("/api/v2/candidate/education/{education}/delete DELETE requests @candidate", async () => {
    // test.beforeAll(async () => {
    //     await deleteAllEducations(authObjects.candidateOneAuthHeaders);
    // });

    test("DELETE with valid education id and valid token @happy", async ({ request }) => {
        const education = await createEducation(authObjects.candidateOneAuthHeaders);
        const response = await request.delete(`/api/v2/candidate/education/${education.data.id}/delete`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Deleted.");
    });

    // TODO: Report issue, response status should be 400
    test("DELETE with valid education id and valid token of another candidate @security", async ({ request }) => {
        const education = await createEducation(authObjects.candidateOneAuthHeaders);
        const response = await request.delete(`/api/v2/candidate/education/${education.data.id}/delete`, {
            headers: authObjects.candidateTwoAuthHeaders
        });

        expect.soft(response.status()).toBe(200);
        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Deleted.");
    });

    test("DELETE with valid education id and valid token of a company @security", async ({ request }) => {
        const education = await createEducation(authObjects.candidateOneAuthHeaders);
        const response = await request.delete(`/api/v2/candidate/education/${education.data.id}/delete`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(480);
        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });

    test("DELETE with already deleted education id", async ({ request }) => {
        // First create and delete an education
        const education = await createEducation(authObjects.candidateOneAuthHeaders);
        const response = await request.delete(`/api/v2/candidate/education/${education.data.id}/delete`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        // Now try to delete the same education again
        const response2 = await request.delete(`/api/v2/candidate/education/${education.data.id}/delete`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect(response2.status()).toBe(200);

        const body = await response2.json();

        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Deleted.");
    });

    test("DELETE with valid education id and invalid token", async ({ request }) => {
        const education = await createEducation(authObjects.candidateOneAuthHeaders);
        const response = await request.delete(`/api/v2/candidate/education/${education.data.id}/delete`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.message).toBe("Unauthenticated.");
    });

    // TODO: Report Issue: Response status should be 400
    test("DELETE with invalid int education id and valid token", async ({ request }) => {
        const response = await request.delete(`/api/v2/candidate/education/12345/delete`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Deleted.");
    });

    // TODO: Report Issue: Response status should be 400
    test("DELETE with invalid string education id and valid token", async ({ request }) => {
        const response = await request.delete(`/api/v2/candidate/education/abcdef/delete`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Deleted.");
    });
});