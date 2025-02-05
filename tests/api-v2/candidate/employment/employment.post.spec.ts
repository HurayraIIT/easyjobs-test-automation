// POST: /api/v2/candidate/employment

import { test, expect } from "@playwright/test";
import authObjects from '@datafactory/auth';
import { getRandomEmploymentData } from "@datafactory/employment";
import { createAssertions } from "@helpers/createAssertions";

test.describe("/api/v2/candidate/employment POST requests @candidate", async () => {
  test("POST can create a new employment and edit it @happy @security", async ({ request }) => {
    // Create a new employment
    let employment_data = await getRandomEmploymentData();
    const response = await request.post('/api/v2/candidate/employment', {
      data: employment_data,
      headers: authObjects.candidateOneAuthHeaders
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.status).toBe('SUCCESS');
    expect(body.message).toBe('Updated.');

    expect(body.data.user_id).toBeGreaterThan(0);
    expect(body.data.company_name).toBe(employment_data.company_name);
    expect(body.data.designation).toBe(employment_data.designation);
    expect(body.data.department).toBe(employment_data.department);
    expect(body.data.responsibilities).toBe(employment_data.responsibilities);
    expect(body.data.from).toBeTruthy();
    expect(body.data.to).toBeTruthy();
    expect(body.data.is_currently_working).toBe(false);
    expect(body.data.order).toBeGreaterThan(0);
    expect(body.data.updated_at).toBeTruthy();
    expect(body.data.created_at).toBeTruthy();
    expect(body.data.id).toBeGreaterThan(0);

    // Edit the employment
    let new_employment_data = await getRandomEmploymentData();
    new_employment_data.id = body.data.id;
    const new_response = await request.post('/api/v2/candidate/employment', {
      data: new_employment_data,
      headers: authObjects.candidateOneAuthHeaders
    });

    expect(new_response.status()).toBe(200);

    const new_body = await new_response.json();

    expect(new_body.status).toBe('SUCCESS');
    expect(new_body.message).toBe('Updated.');

    expect(new_body.data.user_id).toBe(body.data.user_id);
    expect(new_body.data.company_name).toBe(new_employment_data.company_name);
    expect(new_body.data.designation).toBe(new_employment_data.designation);
    expect(new_body.data.department).toBe(new_employment_data.department);
    expect(new_body.data.responsibilities).toBe(new_employment_data.responsibilities);
    expect(new_body.data.from).toBeTruthy();
    expect(new_body.data.to).toBeTruthy();
    expect(new_body.data.is_currently_working).toBe(false);
    expect(new_body.data.order).toBeGreaterThan(0);
    expect(new_body.data.updated_at).toBeTruthy();
    expect(new_body.data.created_at).toBeTruthy();
    expect(new_body.data.id).toBe(body.data.id);

    // Another candidate will try to edit the employment
    const new_response_2 = await request.post('/api/v2/candidate/employment', {
      data: new_employment_data,
      headers: authObjects.candidateTwoAuthHeaders
    });

    expect(new_response_2.status()).toBe(200);

    const new_body_2 = await new_response_2.json();
    // await createAssertions(new_body_2);
    expect(new_body_2.status).toBe('SUCCESS');
    // This actually creates a new employment for candidate 2, weird behavior
    expect(new_body_2.data.id).not.toBe(body.data.id); 
  });

  test("POST with empty data", async ({ request }) => {
    const response = await request.post('/api/v2/candidate/employment', {
      data: {},
      headers: authObjects.candidateOneAuthHeaders
    });

    expect(response.status()).toBe(422);

    const body = await response.json();

    //await createAssertions(body);
    expect(body.status).toBe("FAILED");
    expect(body.data).toEqual([]);
    expect(body.message.company_name).toEqual(["The company name field is required."]);
    expect(body.message.designation).toEqual(["The designation field is required."]);
    expect(body.message.department).toEqual(["The department field is required."]);
    expect(body.message.from_date).toEqual(["The from date field is required."]);
  });

  test("POST with no data", async ({ request }) => {
    const response = await request.post('/api/v2/candidate/employment', {
      headers: authObjects.candidateOneAuthHeaders
    });

    expect(response.status()).toBe(422);

    const body = await response.json();

    // await createAssertions(body);
    expect(body.status).toBe("FAILED");
    expect(body.data).toEqual([]);
    expect(body.message.company_name).toEqual(["The company name field is required."]);
    expect(body.message.designation).toEqual(["The designation field is required."]);
    expect(body.message.department).toEqual(["The department field is required."]);
    expect(body.message.from_date).toEqual(["The from date field is required."]);
  });

  test("POST with valid data but no auth", async ({ request }) => {
    const employment_data = await getRandomEmploymentData();

    const response = await request.post('/api/v2/candidate/employment', {
      data: employment_data,
      headers: {
        "Accept": "application/json"
      }
    });

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.message).toBe('Unauthenticated.');
  });

  test("POST with company auth", async ({ request }) => {
    const employment_data = getRandomEmploymentData();

    const response = await request.post('/api/v2/candidate/employment', {
      data: employment_data,
      headers: authObjects.companyOneAuthHeaders
    });

    expect(response.status()).toBe(480);

    const body = await response.json();
    // await createAssertions(body);
    expect(body.status).toBe("failed");
    expect(body.data).toEqual([]);
    expect(body.message).toBe("You do not have access permissions.");
  });
});
