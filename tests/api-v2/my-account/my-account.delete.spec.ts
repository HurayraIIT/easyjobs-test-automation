//DELETE: /api/v2/my-account

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/my-account DELETE requests @my-account", async () => {
    test("DELETE without credentials @security", async ({ request }) => {
        const response = await request.delete(`/api/v2/my-account`, {
            headers: {
                "Accept": "application/json",
                "Company_Id": "2227"
            }
        });

        expect(response.status()).toBe(401);

        const data = await response.json();
        // await createAssertions(data);
        expect(data.message).toBe("Unauthenticated.");
    });

    test("DELETE with another company ID @security", async ({ request }) => {
        // Company two should not be able to delete company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.delete(`/api/v2/my-account`, {
            headers: maliciousHeaders
        });

        expect(response.status()).toBe(471);

        const data = await response.json();
        // await createAssertions(data);
        expect(data.status).toBe("FAILED");
        expect(data.data).toEqual([]);
        expect(data.message).toBe("Something went wrong.");
    });
});