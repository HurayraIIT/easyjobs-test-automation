import { expect, request } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { createAssertions } from '@helpers/createAssertions';
import { category, skills, country, state, city } from '@helpers/static-data';

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