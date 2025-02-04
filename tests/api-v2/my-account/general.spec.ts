//GET: /api/v2/company/assessments/{id}

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/company/assessments/{id} GET requests @company", async () => {
    test.beforeAll(async () => {
        //
    });

    test("GET with valid credentials and valid id @happy", async ({ request }) => {
        //
    });
});