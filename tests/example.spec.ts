import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createJob, getAllDraftJobs } from '@datafactory/job';
import { createQuestionSet, getQuestionSetById } from '@datafactory/question-group';
import { createAssessmentFromQuiz } from '@datafactory/assessment';

// test.describe("auth and test", async () => {
//   test("create quiz", async ({ request }) => {
//     const set_id = await createQuestionSet(authObjects.companyOneAuthHeaders);
//     console.log(set_id);
//     const set = await getQuestionSetById(authObjects.companyOneAuthHeaders, set_id);
//     console.log(set);
//   });
// });