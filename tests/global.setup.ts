import { test as setup, request, expect } from '@playwright/test';
import fs from 'fs';

const authObject = {
    "Authorization": "Bearer",
    "State-Version": "",
    "Company-Id": "",
    "Accept": "application/json",
    "Cookie": "cookies"
};

let authHeaders = {
    companyOneAuthHeaders: authObject,
    companyTwoAuthHeaders: authObject,
    candidateOneAuthHeaders: authObject,
    candidateTwoAuthHeaders: authObject,
};

async function authenticateUser(email: string, password: string): Promise<{ Authorization: string; "State-Version": string; "Company-Id": string; Accept: string; Cookie: string; }> {
    const requestContext = await request.newContext();
    const response = await requestContext.post(`${process.env.BASE_URL}/api/v2/sign-in`, {
        data: {
            email,
            password,
        },
    });

    expect.soft(response.status()).toBe(200);

    const body = await response.json();
    expect(body.message).toBe('Successfully logged in');
    expect(body.data.email).toBe(email);

    return {
        'Authorization': `Bearer ${body['data']['token'] ?? ''}`,
        'State-Version': `${body['data']['state_version'] ?? ''}`,
        'Company-Id': `${body['data']['current_company'] ?? ''}`,
        'Accept': 'application/json',
        'Cookie': `time_zone=Asia/Dhaka; ej_token=${body['data']['token'] ?? ''}`,
    };
}

setup('authenticate and save the headers', async ({ }) => {
    const companyOneEmail = `${process.env.COMPANY_ONE_EMAIL}`;
    const companyTwoEmail = `${process.env.COMPANY_TWO_EMAIL}`;
    const candidateOneEmail = `${process.env.CANDIDATE_ONE_EMAIL}`;
    const candidateTwoEmail = `${process.env.CANDIDATE_TWO_EMAIL}`;
    const password = `${process.env.PASSWORD}`;

    const [companyOneAuthHeaders, companyTwoAuthHeaders, candidateOneAuthHeaders, candidateTwoAuthHeaders] = await Promise.all([
        authenticateUser(companyOneEmail, password),
        authenticateUser(companyTwoEmail, password),
        authenticateUser(candidateOneEmail, password),
        authenticateUser(candidateTwoEmail, password),
    ]);

    // Set headers for each user
    authHeaders.companyOneAuthHeaders = companyOneAuthHeaders;
    authHeaders.companyTwoAuthHeaders = companyTwoAuthHeaders;
    authHeaders.candidateOneAuthHeaders = candidateOneAuthHeaders;
    authHeaders.candidateTwoAuthHeaders = candidateTwoAuthHeaders;

    // write the authHeaders to the .auth/auth.json file
    fs.writeFileSync('.auth/auth.json', JSON.stringify(authHeaders, null, 2));
});