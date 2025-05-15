import { expect, request } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { createAssertions } from '@helpers/createAssertions';
import { category, skills, country, state, city } from '@helpers/static-data';
import { createQuestionSet, getQuestionSetById, QuestionSetType } from './question-group';
import { createCustomApplyField, deleteAllCustomApplyFields, getAllCustomApplyFields } from './custom-fields';

export enum JobStatus {
    DRAFT = 1,
    PUBLISHED = 2,
}

export async function getDataForJobCreate() {
    return {
        "hideCoverPhoto": false,
        "coverphoto": "",
        "title": `Junior Test Engineer - ${faker.vehicle.vehicle()}`,
        "details": "<p>Job Details Line Here.</p>",
        "responsibilities": "<p>Job Responsibilities Here.</p>",
        "category": category,
        "skills": skills,
        "vacancies": "2",
        "job_type": {
            "id": "on-site",
            "name": "On-site"
        },
        "country": country,
        "state": state,
        "city": city,
        "expire_at": "01/01/2030",
        "employment_type": { "id": 3, "name": "Full Time" },
        "experience_level": { "id": 1, "name": "Junior" },
        "salary_type": { "id": 1, "name": "Monthly" },
        "salary": null,
        "salary_range": {
            "max": "20000",
            "min": "12000",
            "currency": "BDT"
        },
        "office_time": "[SUN - THU: 7 AM to 6 PM]",
        "benefits": [],
        "has_benefits": true,
        "employment_type_other": null,
        "show_on_career_page": true
    };
}

export async function createJob(authHeaders: any, job_data: any = null) {
    const requestContext = await request.newContext();
    const response = await requestContext.post('/api/v2/job/create', {
        data: job_data || await getDataForJobCreate(),
        headers: authHeaders
    });

    expect.soft(response.status()).toBe(200);
    const body = await response.json();

    // await createAssertions(body);
    expect(body.status).toBe("SUCCESS");
    expect(body.message).toBe("Job created.");
    return body.data;
}

export async function createDraftJob(authHeaders: any) {
    let data = await createJob(authHeaders);
    return data;
}

export async function createPublishedJob(authHeaders: any) {
    let data = await createJob(authHeaders);
    await changeJobStatus(authHeaders, data.slug, JobStatus.PUBLISHED);
    return data;
}

export async function getAllDraftJobs(authHeaders: any) {
    let draft_jobs = [];

    const requestContext = await request.newContext();
    const response = await requestContext.get('/api/v2/job/draft', {
        headers: authHeaders
    });

    expect.soft(response.status()).toBe(200);
    const body = await response.json();

    // await createAssertions(body);
    expect(body.status).toBe("SUCCESS");
    expect(body.message).toBe(null);

    // run a for loop and get data from https://app.easyjobs.dev/api/v2/job/draft?page=1 to page=last_page and put into draft_jobs
    for (let i = 1; i <= body.data.last_page; i++) {
        const response = await requestContext.get(`/api/v2/job/draft?page=${i}`, {
            headers: authHeaders
        });

        expect.soft(response.status()).toBe(200);
        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.message).toBe(null);

        draft_jobs = draft_jobs.concat(body.data.data);
    }

    return draft_jobs;
}

export async function getAllPublishedJobs(authHeaders: any) {
    let published_jobs = [];

    const requestContext = await request.newContext();
    const response = await requestContext.get('/api/v2/job/published', {
        headers: authHeaders
    });

    expect.soft(response.status()).toBe(200);
    const body = await response.json();

    // await createAssertions(body);
    expect(body.status).toBe("SUCCESS");
    expect(body.message).toBe(null);

    // run a for loop and get data from https://app.easyjobs.dev/api/v2/job/published?page=1 to page=last_page and put into published_jobs
    for (let i = 1; i <= body.data.last_page; i++) {
        const response = await requestContext.get(`/api/v2/job/published?page=${i}`, {
            headers: authHeaders
        });

        expect.soft(response.status()).toBe(200);
        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.message).toBe(null);

        published_jobs = published_jobs.concat(body.data.data);
    }

    return published_jobs;
}

export async function deleteJobBySlug(authHeaders: any, job_slug: string) {
    const requestContext = await request.newContext();
    const response = await requestContext.delete(`/api/v2/job/${job_slug}/delete`, {
        headers: authHeaders
    });

    expect.soft(response.status()).toBe(200);
    const body = await response.json();

    // await createAssertions(body);
    expect(body.status).toBe("SUCCESS");
    expect(body.message).toBe("Job deleted.");
}

export async function deleteAllDraftJobs(authHeaders: any, jobs: any = null) {
    const draft_jobs = jobs || await getAllDraftJobs(authHeaders);
    for (const job of draft_jobs) {
        await deleteJobBySlug(authHeaders, job.slug);
    }
}

export async function deleteAllPublishedJobs(authHeaders: any, jobs: any = null) {
    const published_jobs = jobs || await getAllPublishedJobs(authHeaders);
    for (const job of published_jobs) {
        await deleteJobBySlug(authHeaders, job.slug);
    }
}

export async function addScreeningToJob(authHeaders: any, job_slug: string, screening_data: any = null) {
    if (!screening_data) {
        let first_job = await createJob(authHeaders);
        let new_question_set_id = await createQuestionSet(authHeaders, QuestionSetType.SCREENING);
        let questions = await getQuestionSetById(authHeaders, new_question_set_id);
        // console.log(questions);
        screening_data = {
            "job_id": first_job.id,
            "note": questions.note,
            "internal_note": questions.internal_note,
            "questions": questions.questions
        };
    }

    const requestContext = await request.newContext();
    const response = await requestContext.post(`/api/v2/job/${job_slug}/screening`, {
        headers: authHeaders,
        data: screening_data
    });

    expect.soft(response.status()).toBe(200);
    const body = await response.json();

    // await createAssertions(body);
    expect(body.status).toBe("SUCCESS");
    expect(body.message).toBe("Job updated.");
    return body.data;
}

export async function addQuizToJob(authHeaders: any, job_slug: string, quiz_data: any = null) {
    if (!quiz_data) {
        let first_job = await createJob(authHeaders);
        let new_question_set_id = await createQuestionSet(authHeaders, QuestionSetType.QUIZ);
        let questions = await getQuestionSetById(authHeaders, new_question_set_id);
        // console.log(questions);
        quiz_data = {
            "job_id": first_job.id,
            "note": questions.note,
            "internal_note": questions.internal_note,
            "exam_duration": "31",
            "marks_per_question": "11",
            "questions": questions.questions,
        };
    }

    const requestContext = await request.newContext();
    const response = await requestContext.post(`/api/v2/job/${job_slug}/quiz`, {
        headers: authHeaders,
        data: quiz_data
    });

    expect.soft(response.status()).toBe(200);
    const body = await response.json();

    // await createAssertions(body);
    expect(body.status).toBe("SUCCESS");
    expect(body.message).toBe("Job updated.");
    return body.data;
}

export async function addApplyFieldsToJob(authHeaders: any, job_slug: string, apply_fields_data: any = null) {
    if (!apply_fields_data) {
        await deleteAllCustomApplyFields(authHeaders);
        await createCustomApplyField(authHeaders);
        let custom_apply_fields = await getAllCustomApplyFields(authHeaders);

        // console.log(custom_apply_fields[0]);

        let apply_fields_data = {
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
    }

    const requestContext = await request.newContext();
    const response = await requestContext.post(`/api/v2/job/${job_slug}/required-fields`, {
        headers: authHeaders,
        data: apply_fields_data
    });

    expect.soft(response.status()).toBe(200);

    const body = await response.json();
    // console.log(body.data.apply_rules);
    // await createAssertions(body);

    expect(body.status).toBe("SUCCESS");
    expect(body.data).toEqual([]);
    expect(body.message).toBe("Updated.");
}

export async function changeJobStatus(authHeaders: any, job_slug: string, status: JobStatus) {
    const requestContext = await request.newContext();
    const response = await requestContext.post(`/api/v2/job/${job_slug}/change-status`, {
        headers: authHeaders,
        data: { "status": status }
    });

    expect.soft(response.status()).toBe(200);
    const body = await response.json();

    // await createAssertions(body);
    expect(body.status).toBe("SUCCESS");
    expect(body.data.status).toBe(status);
}