// GET: /api/v2/job/{job}/required-fields

import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { deleteAllDraftJobs, createJob } from '@datafactory/job';
import { createAssertions } from "@helpers/createAssertions";
import { create } from 'domain';
import { createCustomApplyField, deleteAllCustomApplyFields } from '@datafactory/custom-fields';

test.describe("/api/v2/job/{job}/required-fields GET requests @company", async () => {
    let new_job = null;
    let job = null;
    test.beforeAll(async () => {
        // await deleteAllDraftJobs(authObjects.companyOneAuthHeaders);
        // await deleteAllDraftJobs(authObjects.companyTwoAuthHeaders);
        new_job = await createJob(authObjects.companyOneAuthHeaders);
        job = new_job.slug;
        await deleteAllCustomApplyFields(authObjects.companyOneAuthHeaders);
        await createCustomApplyField(authObjects.companyOneAuthHeaders);
    });

    test.afterAll(async () => {
        await deleteAllDraftJobs(authObjects.companyOneAuthHeaders);
        await deleteAllCustomApplyFields(authObjects.companyOneAuthHeaders);
    });

    test("GET with valid company credentials @happy", async ({ request }) => {
        const response = await request.get(`/api/v2/job/${job}/required-fields`, {
            headers: authObjects.companyOneAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // console.log(body.data.apply_rules);
        // await createAssertions(custom_fields);

        expect(body.status).toBe("SUCCESS");
        expect(body.message).toBe(null);

        let apply_rules = body.data.apply_rules;
        let custom_fields = body.data.custom_fields;

        // Apply Rules
        expect(apply_rules[0].index).toBe(0);
        expect(apply_rules[0].name).toBe("Basic Information");
        expect(apply_rules[0].id).toBe("basic_information");
        expect(apply_rules[0].selected).toEqual(["first_name", "last_name", "email"]);
        expect(apply_rules[0].required).toEqual(["first_name", "last_name", "email"]);
        expect(apply_rules[0].rules[0].field).toBe("first_name");
        expect(apply_rules[0].rules[0].name).toBe("First Name");
        expect(apply_rules[0].rules[1].field).toBe("last_name");
        expect(apply_rules[0].rules[1].name).toBe("Last Name");
        expect(apply_rules[0].rules[2].field).toBe("email");
        expect(apply_rules[0].rules[2].name).toBe("email address");
        expect(apply_rules[0].rules[3].field).toBe("phone_number");
        expect(apply_rules[0].rules[3].name).toBe("Phone number");
        expect(apply_rules[0].rules[4].field).toBe("nationality");
        expect(apply_rules[0].rules[4].name).toBe("Nationality");
        expect(apply_rules[0].rules[5].field).toBe("national_id");
        expect(apply_rules[0].rules[5].name).toBe("National ID");
        expect(apply_rules[0].rules[6].field).toBe("dob");
        expect(apply_rules[0].rules[6].name).toBe("Date of Birth");
        expect(apply_rules[0].rules[7].field).toBe("gender");
        expect(apply_rules[0].rules[7].name).toBe("Gender");
        expect(apply_rules[1].index).toBe(1);
        expect(apply_rules[1].name).toBe("Educational Qualification");
        expect(apply_rules[1].id).toBe("education_qualification");
        expect(apply_rules[1].required).toEqual([]);
        expect(apply_rules[1].rules[0].field).toBe("education.*.level_id");
        expect(apply_rules[1].rules[0].name).toBe("Level of Education");
        expect(apply_rules[1].rules[1].field).toBe("education.*.degree_id");
        expect(apply_rules[1].rules[1].name).toBe("Exam or Degree Title");
        expect(apply_rules[1].rules[2].field).toBe("education.*.passing_year");
        expect(apply_rules[1].rules[2].name).toBe("Year of passing");
        expect(apply_rules[1].rules[3].field).toBe("education.*.academy_name");
        expect(apply_rules[1].rules[3].name).toBe("Institute name");
        expect(apply_rules[2].index).toBe(2);
        expect(apply_rules[2].name).toBe("Employment History");
        expect(apply_rules[2].id).toBe("employment_history");
        expect(apply_rules[2].required).toEqual([]);
        expect(apply_rules[2].rules[0].field).toBe("employment.*.company_id");
        expect(apply_rules[2].rules[0].name).toBe("Company Name");
        expect(apply_rules[2].rules[1].field).toBe("employment.*.designation");
        expect(apply_rules[2].rules[1].name).toBe("Designation");
        expect(apply_rules[2].rules[2].field).toBe("employment.*.department_id");
        expect(apply_rules[2].rules[2].name).toBe("Department");
        expect(apply_rules[2].rules[3].field).toBe("employment.*.from");
        expect(apply_rules[2].rules[3].name).toBe("Employment Period");
        expect(apply_rules[2].rules[4].field).toBe("employment.*.allow_no_experience");
        expect(apply_rules[2].rules[4].name).toBe("Allow No Job Experience to Apply");
        expect(apply_rules[3].index).toBe(3);
        expect(apply_rules[3].name).toBe("Others");
        expect(apply_rules[3].id).toBe("social_media");
        expect(apply_rules[3].selected).toEqual([]);
        expect(apply_rules[3].required).toEqual([]);
        expect(apply_rules[3].rules[0].field).toBe("expected_salary");
        expect(apply_rules[3].rules[0].name).toBe("Expected Salary");
        expect(apply_rules[3].rules[1].field).toBe("linkedin");
        expect(apply_rules[3].rules[1].name).toBe("LinkedIn profile link");
        expect(apply_rules[3].rules[2].field).toBe("facebook");
        expect(apply_rules[3].rules[2].name).toBe("Facebook profile link");
        expect(apply_rules[4].index).toBe(4);
        expect(apply_rules[4].name).toBe("Documents");
        expect(apply_rules[4].id).toBe("documents");
        expect(apply_rules[4].selected).toEqual([]);
        expect(apply_rules[4].required).toEqual([]);
        expect(apply_rules[4].rules[0].field).toBe("cover_letter");
        expect(apply_rules[4].rules[0].name).toBe("Cover Letter");
        expect(apply_rules[4].rules[1].field).toBe("photo");
        expect(apply_rules[4].rules[1].name).toBe("Photo");
        expect(apply_rules[4].rules[2].field).toBe("resume");
        expect(apply_rules[4].rules[2].name).toBe("Resume");
        expect(apply_rules[4].rules[3].field).toBe("video");
        expect(apply_rules[4].rules[3].name).toBe("Video");

        // Custom Fields
        expect(custom_fields.rules[0].name).toContain("text");
        expect(custom_fields.rules[0].field).toContain("text");
        expect(custom_fields.selected).toEqual([]);
        expect(custom_fields.required).toEqual([]);
    });

    test("GET with another company credentials @security", async ({ request }) => {
        const response = await request.get(`/api/v2/job/${job}/required-fields`, {
            headers: authObjects.companyTwoAuthHeaders
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // console.log(body.data.custom_fields);

        let apply_rules = body.data.apply_rules;
        let custom_fields = body.data.custom_fields;

        expect(apply_rules[0].name).toBe("Basic Information");
        expect(apply_rules[1].name).toBe("Educational Qualification");
        expect(apply_rules[2].name).toBe("Employment History");
        expect(apply_rules[3].name).toBe("Others");
        expect(apply_rules[4].name).toBe("Documents");

        expect(custom_fields.rules).toEqual([]);
        expect(custom_fields.selected).toEqual([]);
        expect(custom_fields.required).toEqual([]);
    });

    test("GET with valid candidate credentials", async ({ request }) => {
        const response = await request.get(`/api/v2/job/${job}/required-fields`, {
            headers: authObjects.candidateOneAuthHeaders
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("failed");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("You do not have access permissions.");
    });

    test("GET without auth token", async ({ request }) => {
        const response = await request.get(`/api/v2/job/${job}/required-fields`, {
            headers: {
                "ACCEPT": "application/json",
            }
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });

    test("GET with invalid credentials", async ({ request }) => {
        // Company two should not be able to access data from company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        // maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.get(`/api/v2/job/${job}/required-fields`, {
            headers: maliciousHeaders
        });
        expect.soft(response.status()).toBe(471);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Something went wrong.");
    });
});
