import { expect, request } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { createAssertions } from '@helpers/createAssertions';
import { createQuestionSet, getQuestionSetById, getQuizQuestionSetQuestions, getRandomTitle, QuestionSetType } from './question-group';
import { create } from 'domain';

/**
 * Fetches assessment creation data including metadata and questions.
 * 
 * @param {Record<string, string>} authHeaders - The authorization headers.
 * @param {number} id - The ID of the quiz question set.
 * @returns {Promise<{
 *     assessment_name: string;
 *     exam_duration: string;
 *     marks_per_question: string;
 *     id: null;
 *     internal_note: string;
 *     note: string;
 *     questions: any[];
 *     set_type: string;
 * }>} A promise that resolves to an object containing the assessment creation data.
 * 
 * @example
 * const authHeaders = {
 *   'Authorization': 'Bearer some_token',
 *   'State-Version': 'some_state_version',
 *   'Company-Id': 'some_company_id',
 *   'Accept': 'application/json',
 *   'Cookie': 'time_zone=Asia/Dhaka; ej_token=some_token'
 * };
 * 
 * const id = 123;
 * const data = await getAssessmentCreationData(authHeaders, id);
 * console.log(data);
 * // {
 * //   assessment_name: 'Assessment: Some Random Title',
 * //   exam_duration: '45',
 * //   marks_per_question: '5',
 * //   id: null,
 * //   internal_note: 'Some internal note',
 * //   note: 'Some note',
 * //   questions: [...],
 * //   set_type: 'ASSESSMENT'
 * // }
 */
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

    expect(data.status).toBe('SUCCESS');
    expect(data.message).toBe('Assessment created.');
    expect(data.data).toEqual([]);

    const all_assessments = await getAllAssessments(authHeaders);

    for (const assessment of all_assessments) {
        if (assessment.name === assessment_creation_data.assessment_name) {
            return assessment;
        }
    }
}

export async function getAllAssessments(authHeaders: any) {
    const requestContext = await request.newContext();
    const response = await requestContext.get(`/api/v2/company/assessments`, {
        headers: authHeaders
    });

    expect(response.status()).toBe(200);

    const data = await response.json();

    expect(data.status).toBe('SUCCESS');
    expect(data.message).toBeNull();
    expect(data.data.length).toBeGreaterThanOrEqual(0);

    return data.data;
}

export async function getAssessmentById(authHeaders: any, id: number) {
    const requestContext = await request.newContext();
    const response = await requestContext.get(`/api/v2/company/assessments/${id}`, {
        headers: authHeaders
    });

    expect(response.status()).toBe(200);

    const data = await response.json();

    expect(data.status).toBe('SUCCESS');
    expect(data.message).toBeNull();
    expect(data.data.id).toBe(id);

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

    const responseData = await response.json();

    expect(responseData.status).toBe('SUCCESS');
    expect(responseData.message).toBe('Saved.');
    expect(responseData.data).toBeNull();
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

    expect(data.status).toBe('SUCCESS');
    expect(data.message).toBe('Assessment deleted.');
    expect(data.data).toEqual([]);
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

    const remaining_assessments = await getAllAssessments(authHeaders);
    expect(remaining_assessments.length).toBe(0);
}

export async function createBulkAssessments(authHeaders: any, count: number) {
    for (let i = 0; i < count; i++) {
        const quiz = await createQuestionSet(authHeaders, QuestionSetType.QUIZ);
        await createAssessmentFromQuiz(authHeaders, quiz.id);
    }
}