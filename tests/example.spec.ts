import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createJob, getAllDraftJobs } from '@datafactory/job';
import { createQuestionSet, getQuestionSetById } from '@datafactory/question-group';
import { createAssessmentFromQuiz, deleteAllAssessments } from '@datafactory/assessment';

// test("create quiz", async ({ request }) => {
//     await deleteAllAssessments(authObjects.companyOneAuthHeaders);
// });
