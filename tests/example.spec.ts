import { test, expect } from '@playwright/test';
import authObjects from '@datafactory/auth';
import { createJob, getAllDraftJobs } from '@datafactory/job';
import { createQuestionSet, getQuestionSetById } from '@datafactory/question-group';
import { createAssessmentFromQuiz, createBulkAssessments, deleteAllAssessments } from '@datafactory/assessment';
import { createCustomApplyField } from '@datafactory/custom-fields';

// test("create quiz", async ({ request }) => {
//     // Create a new question set
//     await createCustomApplyField(authObjects.companyOneAuthHeaders);
// });
