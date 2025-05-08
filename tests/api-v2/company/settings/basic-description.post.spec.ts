//POST: /api/v2/company/setting/basic-description

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

const data = {
    "company": {
        "description": `<p>Test Company Description:</p><p>&nbsp;</p><p><strong>Bold Text.</strong></p><p><i>Italic text.</i></p><p><u>Underlined Text.</u></p><p>This is <a href=\"https://hurayraiit.com\">a link</a>.</p><p>&nbsp;</p><p>OL</p><p>&nbsp;</p><ol style=\"list-style-type:decimal-leading-zero;\"><li>list one ol one</li><li>list one ol two</li></ol><p>&nbsp;</p><p>UL</p><p>&nbsp;</p><ul><li>list one ul one</li><li>list one ul two</li></ul>`,
        "benefits": `<p>Test Company Benefits:</p><p>&nbsp;</p><p><strong>Bold Text.</strong></p><p><i>Italic text.</i></p><p><u>Underlined Text.</u></p><p>This is <a href=\"https://hurayraiit.com\">a link</a>.</p><p>&nbsp;</p><p>OL</p><p>&nbsp;</p><ol style=\"list-style-type:decimal-leading-zero;\"><li>list one ol one</li><li>list one ol two</li></ol><p>&nbsp;</p><p>UL</p><p>&nbsp;</p><ul><li>list one ul one</li><li>list one ul two</li></ul>`
    }
};

test.describe("/api/v2/company/setting/basic-description POST requests @company", async () => {
    test("POST with valid credentials @happy", async ({ request }) => {
        // POST the basic description
        const response = await request.post(`/api/v2/company/setting/basic-description`, {
            headers: authObjects.companyOneAuthHeaders,
            data: data
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.message).toBe("Company description updated.");
    });

    test("POST with invalid credentials", async ({ request }) => {
        const response = await request.post(`/api/v2/company/setting/basic-description`, {
            headers: {
                "Accept": "application/json"
            },
            data: data
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe("Unauthenticated.");
    });

    test("POST with valid credentials but another company ID", async ({ request }) => {
        // Company two should not be able to modify data from company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.post(`/api/v2/company/setting/basic-description`, {
            headers: maliciousHeaders,
            data: data
        });

        expect.soft(response.status()).toBe(400);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });

    test("POST with candidate auth", async ({ request }) => {
        const response = await request.post(`/api/v2/company/setting/basic-description`, {
            headers: authObjects.candidateOneAuthHeaders,
            data: data
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });
});