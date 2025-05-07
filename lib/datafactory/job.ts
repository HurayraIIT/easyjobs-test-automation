import { expect, request } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { createAssertions } from '@helpers/createAssertions';
import { category, skills, country, state, city } from '@helpers/static-data';
import { createQuestionSet, getQuestionSetById } from './question-group';

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

    expect(response.status()).toBe(200);
    const body = await response.json();

    // await createAssertions(body);
    expect(body.status).toBe("SUCCESS");
    expect(body.message).toBe("Job created.");
    return body.data;
}

export async function getAllDraftJobs(authHeaders: any) {
    let draft_jobs = [];

    const requestContext = await request.newContext();
    const response = await requestContext.get('/api/v2/job/draft', {
        headers: authHeaders
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    // await createAssertions(body);
    expect(body.status).toBe("SUCCESS");
    expect(body.message).toBe(null);

    // run a for loop and get data from https://app.easyjobs.dev/api/v2/job/draft?page=1 to page=last_page and put into draft_jobs
    for (let i = 1; i <= body.data.last_page; i++) {
        const response = await requestContext.get(`/api/v2/job/draft?page=${i}`, {
            headers: authHeaders
        });

        expect(response.status()).toBe(200);
        const body = await response.json();

        // await createAssertions(body);
        expect(body.status).toBe("SUCCESS");
        expect(body.message).toBe(null);

        draft_jobs = draft_jobs.concat(body.data.data);
    }

    return draft_jobs;
}

export async function deleteJobBySlug(authHeaders: any, job_slug: string) {
    const requestContext = await request.newContext();
    const response = await requestContext.delete(`/api/v2/job/${job_slug}/delete`, {
        headers: authHeaders
    });

    expect(response.status()).toBe(200);
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

export async function addScreeningToJob(authHeaders: any, job_slug: string, screening_data: any = null) {
    if (!screening_data) {
        let first_job = await createJob(authHeaders);
        let new_question_set_id = await createQuestionSet(authHeaders);
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

    expect(response.status()).toBe(200);
    const body = await response.json();

    // await createAssertions(body);
    expect(body.status).toBe("SUCCESS");
    expect(body.message).toBe("Job updated.");
    return body.data;
}