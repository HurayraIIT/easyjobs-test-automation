import { expect, request } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { createAssertions } from '@helpers/createAssertions';
import { createQuestionSet, getQuestionSetById, getQuizQuestionSetQuestions, getRandomTitle, QuestionSetType } from './question-group';

export async function getAssessmentCreationData(authHeaders: Record<string, string>, id: number): Promise<{
    assessment_name: string;
    exam_duration: string;
    marks_per_question: string;
    id: null;
    internal_note: string;
    note: string;
    questions: any[];
    set_type: { id: number | null, name: string };
}> {
    const questions = await getQuizQuestionSetQuestions(authHeaders, id);
    const quizMetaData = await getQuestionSetById(authHeaders, id);

    return {
        assessment_name: `❓ Assessment: ${getRandomTitle()}`,
        exam_duration: `${faker.number.int({ min: 1, max: 60 })}`,
        marks_per_question: `${faker.number.int({ min: 1, max: 10 })}`,
        id: null,
        internal_note: quizMetaData.internal_note,
        note: quizMetaData.note,
        questions: questions.questions,
        set_type: QuestionSetType.ASSESSMENT
    };
}

export async function createAssessmentFromQuiz(authHeaders: any, id: number) {
    const assessment_creation_data = await getAssessmentCreationData(authHeaders, id);

    const requestContext = await request.newContext();
    const response = await requestContext.post(`/api/v2/company/assessments/create`, {
        headers: authHeaders,
        data: assessment_creation_data,
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    return data.data.id;
}

export async function getAllAssessments(authHeaders: any) {
    const requestContext = await request.newContext();
    const response = await requestContext.get(`/api/v2/company/assessments`, {
        headers: authHeaders
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    return data.data;
}

export async function getAssessmentById(authHeaders: any, id: number) {
    const requestContext = await request.newContext();
    const response = await requestContext.get(`/api/v2/company/assessments/${id}`, {
        headers: authHeaders
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    return data.data;
}

/**
 * Updates an assessment.
 * @param authHeaders - The authentication headers.
 * @param assessment_id - The ID of the assessment to update.
 * @param data - The data to update the assessment with.
 * @returns {Promise<void>}
 */
export async function updateAssessment(authHeaders: any, assessment_id: number, data: any): Promise<void> {
    const requestContext = await request.newContext();
    const response = await requestContext.put(`/api/v2/company/assessments/${assessment_id}/update`, {
        headers: authHeaders,
        data: data,
    });

    expect(response.status()).toBe(200);
}

/**
 * Deletes an assessment by its ID.
 * @param authHeaders - The authentication headers.
 * @param assessment_id - The ID of the assessment to delete.
 * @returns A Promise that resolves when the assessment is successfully deleted.
 */
export async function deleteAssessmentById(authHeaders: any, assessment_id: number): Promise<void> {
    const requestContext = await request.newContext();
    const response = await requestContext.delete(`/api/v2/company/assessments/${assessment_id}/delete`, {
        headers: authHeaders
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
}

/**
 * Deletes all assessments.
 * @param authHeaders - The authentication headers.
 * @returns {Promise<void>}
 */
/**
 * Deletes all assessments.
 * @param authHeaders - The authentication headers.
 * @returns {Promise<void>}
 * @example
 * // Example usage:
 * const authHeaders = { token: 'your_token' };
 * await deleteAllAssessments(authHeaders);
 */
export async function deleteAllAssessments(authHeaders: any): Promise<void> {
    const assessments = await getAllAssessments(authHeaders);

    for (const assessment of assessments) {
        await deleteAssessmentById(authHeaders, assessment.id);
    }
}

export async function createBulkAssessments(authHeaders: any, count: number) {
    for (let i = 0; i < count; i++) {
        const quiz_id = await createQuestionSet(authHeaders, QuestionSetType.QUIZ);
        await createAssessmentFromQuiz(authHeaders, quiz_id);
    }
}