// POST: /api/v2/job/{job}/required-fields

import authObjects from '@datafactory/auth';
import { test, expect } from '@playwright/test';
import { createAssertions } from "@helpers/createAssertions";
import { deleteAllDraftJobs, createJob } from '@datafactory/job';
import { createCustomApplyField, deleteAllCustomApplyFields, getAllCustomApplyFields } from '@datafactory/custom-fields';

test.describe("/api/v2/job/{job}/required-fields POST requests @company", async () => {
    let new_job = null;
    let job = null;
    let custom_apply_fields = null;
    let data = null;

    test.beforeAll(async () => {
        await deleteAllDraftJobs(authObjects.companyOneAuthHeaders);
        await deleteAllCustomApplyFields(authObjects.companyOneAuthHeaders);
        new_job = await createJob(authObjects.companyOneAuthHeaders);
        job = new_job.slug;
        await createCustomApplyField(authObjects.companyOneAuthHeaders);
        custom_apply_fields = await getAllCustomApplyFields(authObjects.companyOneAuthHeaders);

        // console.log(custom_apply_fields[0]);

        data = {
            "apply_rules": [
                {
                    "index": 0,
                    "name": "Basic Information",
                    "id": "basic_information",
                    "selected": [
                        "first_name",
                        "last_name",
                        "email",
                        "phone_number",
                        "nationality",
                        "national_id",
                        "dob",
                        "gender"
                    ],
                    "required": [
                        "first_name",
                        "last_name",
                        "email",
                        "phone_number",
                        "nationality",
                        "national_id",
                        "dob",
                        "gender"
                    ],
                    "rules": [
                        {
                            "field": "first_name",
                            "name": "First Name"
                        },
                        {
                            "field": "last_name",
                            "name": "Last Name"
                        },
                        {
                            "field": "email",
                            "name": "email address"
                        },
                        {
                            "field": "phone_number",
                            "name": "Phone number"
                        },
                        {
                            "field": "nationality",
                            "name": "Nationality"
                        },
                        {
                            "field": "national_id",
                            "name": "National ID"
                        },
                        {
                            "field": "dob",
                            "name": "Date of Birth"
                        },
                        {
                            "field": "gender",
                            "name": "Gender"
                        }
                    ],
                    "selectAll": true
                },
                {
                    "index": 1,
                    "name": "Educational Qualification",
                    "id": "education_qualification",
                    "selected": true,
                    "required": [],
                    "rules": [
                        {
                            "field": "education.*.level_id",
                            "name": "Level of Education"
                        },
                        {
                            "field": "education.*.degree_id",
                            "name": "Exam or Degree Title"
                        },
                        {
                            "field": "education.*.passing_year",
                            "name": "Year of passing"
                        },
                        {
                            "field": "education.*.academy_name",
                            "name": "Institute name"
                        }
                    ]
                },
                {
                    "index": 2,
                    "name": "Employment History",
                    "id": "employment_history",
                    "selected": true,
                    "required": [],
                    "rules": [
                        {
                            "field": "employment.*.company_id",
                            "name": "Company Name"
                        },
                        {
                            "field": "employment.*.designation",
                            "name": "Designation"
                        },
                        {
                            "field": "employment.*.department_id",
                            "name": "Department"
                        },
                        {
                            "field": "employment.*.from",
                            "name": "Employment Period"
                        },
                        {
                            "field": "employment.*.allow_no_experience",
                            "name": "Allow No Job Experience to Apply",
                            "visibility": true
                        }
                    ]
                },
                {
                    "index": 3,
                    "name": "Others",
                    "id": "social_media",
                    "selected": [
                        "expected_salary",
                        "linkedin",
                        "facebook"
                    ],
                    "required": [
                        "expected_salary",
                        "linkedin",
                        "facebook"
                    ],
                    "rules": [
                        {
                            "field": "expected_salary",
                            "name": "Expected Salary"
                        },
                        {
                            "field": "linkedin",
                            "name": "LinkedIn profile link"
                        },
                        {
                            "field": "facebook",
                            "name": "Facebook profile link"
                        }
                    ],
                    "selectAll": true
                },
                {
                    "index": 4,
                    "name": "Documents",
                    "id": "documents",
                    "selected": [
                        "cover_letter",
                        "photo",
                        "resume",
                        "video"
                    ],
                    "required": [
                        "cover_letter",
                        "photo",
                        "resume",
                        "video"
                    ],
                    "rules": [
                        {
                            "field": "cover_letter",
                            "name": "Cover Letter"
                        },
                        {
                            "field": "photo",
                            "name": "Photo"
                        },
                        {
                            "field": "resume",
                            "name": "Resume"
                        },
                        {
                            "field": "video",
                            "name": "Video"
                        }
                    ],
                    "selectAll": true
                }
            ],
            "custom_fields": {
                "rules": [
                    {
                        "name": `${custom_apply_fields[0].title}`,
                        "field": `${custom_apply_fields[0].field_name}`
                    }
                ],
                "selected": [
                    `${custom_apply_fields[0].field_name}`
                ],
                "required": [
                    `${custom_apply_fields[0].field_name}`
                ],
                "selectAll": true
            }
        };
    });

    test.afterAll(async () => {
        // await deleteAllDraftJobs(authObjects.companyOneAuthHeaders);
        // await deleteAllCustomApplyFields(authObjects.companyOneAuthHeaders);
    });

    test("POST with valid company credentials @happy", async ({ request }) => {
        const response = await request.post(`/api/v2/job/${job}/required-fields`, {
            headers: authObjects.companyOneAuthHeaders,
            data: data
        });

        expect.soft(response.status()).toBe(200);

        const body = await response.json();
        // console.log(body.data.apply_rules);
        // await createAssertions(body);

        expect(body.status).toBe("SUCCESS");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Updated.");
    });

    test("POST with another company credentials @security", async ({ request }) => {
        const response = await request.post(`/api/v2/job/${job}/required-fields`, {
            headers: authObjects.companyTwoAuthHeaders,
            data: data
        });

        expect.soft(response.status()).toBe(480);

        const body = await response.json();
        // await createAssertions(body);
        expect(body.status).toBe("FAILED");
        expect(body.data).toEqual([]);
        expect(body.message).toBe("Unauthorized Access");
    });

    test("POST with valid candidate credentials", async ({ request }) => {
        const response = await request.post(`/api/v2/job/${job}/required-fields`, {
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

    test("POST without auth token", async ({ request }) => {
        const response = await request.post(`/api/v2/job/${job}/required-fields`, {
            headers: {
                "ACCEPT": "application/json",
            },
            data: data
        });

        expect.soft(response.status()).toBe(401);

        const body = await response.json();
        expect(body.message).toBe('Unauthenticated.');
    });

    test("POST with invalid credentials", async ({ request }) => {
        // Company two should not be able to access data from company one
        const maliciousHeaders = authObjects.companyTwoAuthHeaders;
        maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
        // maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];

        const response = await request.post(`/api/v2/job/${job}/required-fields`, {
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
});
