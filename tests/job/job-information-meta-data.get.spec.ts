// GET: /api/v2/job/information-meta-data

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/job/information-meta-data GET requests @company", async () => {
    test("GET with valid credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/job/information-meta-data`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.employment_type[0].id).toBe(1);
        expect(body.employment_type[0].name).toBe("Permanent");
        expect(body.employment_type[1].id).toBe(2);
        expect(body.employment_type[1].name).toBe("Contractual");
        expect(body.employment_type[2].id).toBe(3);
        expect(body.employment_type[2].name).toBe("Full Time");
        expect(body.employment_type[3].id).toBe(4);
        expect(body.employment_type[3].name).toBe("Part Time");
        expect(body.employment_type[4].id).toBe(5);
        expect(body.employment_type[4].name).toBe("Freelance");
        expect(body.employment_type[5].id).toBe(6);
        expect(body.employment_type[5].name).toBe("Internship");
        expect(body.employment_type[6].id).toBe(7);
        expect(body.employment_type[6].name).toBe("College Program");
        expect(body.employment_type[7].id).toBe(99);
        expect(body.employment_type[7].name).toBe("Other");
        expect(body.salary_type[0].id).toBe(1);
        expect(body.salary_type[0].name).toBe("Monthly");
        expect(body.salary_type[1].id).toBe(2);
        expect(body.salary_type[1].name).toBe("Annually");
        expect(body.salary_type[2].id).toBe(3);
        expect(body.salary_type[2].name).toBe("Hourly");
        expect(body.salary_type[3].id).toBe(4);
        expect(body.salary_type[3].name).toBe("Weekly");
        expect(body.salary_type[4].id).toBe(5);
        expect(body.salary_type[4].name).toBe("One Time");
        expect(body.salary_type[5].id).toBe(6);
        expect(body.salary_type[5].name).toBe("Bi-Weekly");
        expect(body.salary_type[6].id).toBe(7);
        expect(body.salary_type[6].name).toBe("Others");
        expect(body.experience_level[0].id).toBe(1);
        expect(body.experience_level[0].name).toBe("Junior");
        expect(body.experience_level[1].id).toBe(2);
        expect(body.experience_level[1].name).toBe("Intermediate");
        expect(body.experience_level[2].id).toBe(3);
        expect(body.experience_level[2].name).toBe("Senior");
        expect(body.job_type[0].id).toBe("on-site");
        expect(body.job_type[0].name).toBe("On-site");
        expect(body.job_type[1].id).toBe("remote");
        expect(body.job_type[1].name).toBe("Remote");
        expect(body.job_type[2].id).toBe("hybrid");
        expect(body.job_type[2].name).toBe("Hybrid");
    });

    test("GET without valid credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/job/information-meta-data`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect(response.status()).toBe(200);

        const body = await response.json();

        // await createAssertions(body);
        expect(body.employment_type[0].id).toBe(1);
        expect(body.employment_type[0].name).toBe("Permanent");
        expect(body.employment_type[1].id).toBe(2);
        expect(body.employment_type[1].name).toBe("Contractual");
        expect(body.employment_type[2].id).toBe(3);
        expect(body.employment_type[2].name).toBe("Full Time");
        expect(body.employment_type[3].id).toBe(4);
        expect(body.employment_type[3].name).toBe("Part Time");
        expect(body.employment_type[4].id).toBe(5);
        expect(body.employment_type[4].name).toBe("Freelance");
        expect(body.employment_type[5].id).toBe(6);
        expect(body.employment_type[5].name).toBe("Internship");
        expect(body.employment_type[6].id).toBe(7);
        expect(body.employment_type[6].name).toBe("College Program");
        expect(body.employment_type[7].id).toBe(99);
        expect(body.employment_type[7].name).toBe("Other");
        expect(body.salary_type[0].id).toBe(1);
        expect(body.salary_type[0].name).toBe("Monthly");
        expect(body.salary_type[1].id).toBe(2);
        expect(body.salary_type[1].name).toBe("Annually");
        expect(body.salary_type[2].id).toBe(3);
        expect(body.salary_type[2].name).toBe("Hourly");
        expect(body.salary_type[3].id).toBe(4);
        expect(body.salary_type[3].name).toBe("Weekly");
        expect(body.salary_type[4].id).toBe(5);
        expect(body.salary_type[4].name).toBe("One Time");
        expect(body.salary_type[5].id).toBe(6);
        expect(body.salary_type[5].name).toBe("Bi-Weekly");
        expect(body.salary_type[6].id).toBe(7);
        expect(body.salary_type[6].name).toBe("Others");
        expect(body.experience_level[0].id).toBe(1);
        expect(body.experience_level[0].name).toBe("Junior");
        expect(body.experience_level[1].id).toBe(2);
        expect(body.experience_level[1].name).toBe("Intermediate");
        expect(body.experience_level[2].id).toBe(3);
        expect(body.experience_level[2].name).toBe("Senior");
        expect(body.job_type[0].id).toBe("on-site");
        expect(body.job_type[0].name).toBe("On-site");
        expect(body.job_type[1].id).toBe("remote");
        expect(body.job_type[1].name).toBe("Remote");
        expect(body.job_type[2].id).toBe("hybrid");
        expect(body.job_type[2].name).toBe("Hybrid");
    });
});