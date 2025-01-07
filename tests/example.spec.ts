import { test } from '@playwright/test';
import { createAuthHeaders } from '@datafactory/auth';
import { createBulkEducations, getRandomEducationLevel, getRandomDegreeTitle } from '@datafactory/education';
import { deleteAllQuestionSets } from '@datafactory/question-group';
import { createBulkAssessments, deleteAllAssessments } from '@datafactory/assessment';

test.describe("auth and test", async () => {
  let candidateAuthHeaders: any;
  let companyAuthHeaders: any;

  test.beforeAll(async () => {
    candidateAuthHeaders = await createAuthHeaders(process.env.CANDIDATE_EMAIL, process.env.CANDIDATE_PASSWORD);
    companyAuthHeaders = await createAuthHeaders(process.env.COMPANY_EMAIL, process.env.COMPANY_PASSWORD);
  });

  test("API Calls Test", async () => {
    console.log(getRandomDegreeTitle());
    console.log(getRandomEducationLevel());
  });
});