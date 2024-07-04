import { test, expect } from '@playwright/test';
import { createAuthHeaders } from '@datafactory/auth';
import { createBulkQuestionSets, createQuestionSet, deleteAllQuestionSets, deleteQuestionSetById, duplicateQuestionSet, getAllQuestionSets, getQuestionSetById, updateQuestionSet } from '@datafactory/question-group';

test.describe("auth and test", async () => {
  let candidateAuthHeaders: any;
  let companyAuthHeaders: any;

  test.beforeAll(async () => {
    candidateAuthHeaders = await createAuthHeaders(process.env.CANDIDATE_EMAIL, process.env.CANDIDATE_PASSWORD);
    companyAuthHeaders = await createAuthHeaders(process.env.COMPANY_EMAIL, process.env.COMPANY_PASSWORD);
  });

  test("Company API Calls Test", async ({ page, request }) => {
    const data = await createQuestionSet(companyAuthHeaders);
    //console.log(data);
  });
});