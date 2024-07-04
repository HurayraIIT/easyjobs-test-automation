import { expect, request } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { createAssertions } from '@helpers/createAssertions';
import { getQuestionSetById, getQuizQuestionSetQuestions, getRandomTitle, QuestionSetType } from './question-group';

export async function getAssessmentCreationData(authHeaders: any, id: number) : Promise<any> {
    const questions = await getQuizQuestionSetQuestions(authHeaders, id);
    const quizMetaData = await getQuestionSetById(authHeaders, id);

    return {
        "assessment_name": `❓Assessment: ${getRandomTitle()}`,
        "exam_duration": `${faker.number.int({ min: 1, max: 60 })}`,
        "marks_per_question": `${faker.number.int({ min: 1, max: 10 })}`,
        "id": null,
        "internal_note": quizMetaData.internal_note,
        "note": quizMetaData.note,
        "questions": questions,
        "set_type": QuestionSetType.ASSESSMENT
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
    expect(data.data).toBe([]);

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

export async function updateAssessment(authHeaders: any, assessment_id: number, data: any) {
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

export async function deleteAssessmentById(authHeaders: any, assessment_id: number) {
    const requestContext = await request.newContext();
    const response = await requestContext.delete(`/api/v2/company/assessments/${assessment_id}/delete`, {
        headers: authHeaders
    });

    expect(response.status()).toBe(200);

    const data = await response.json();

    expect(data.status).toBe('SUCCESS');
    expect(data.message).toBe('Assessment deleted.');
    expect(data.data).toBe([]);
}

export async function deleteAllAssessments(authHeaders: any) {
    const assessments = await getAllAssessments(authHeaders);

    for (const assessment of assessments) {
        await deleteAssessmentById(authHeaders, assessment.id);
    }
    
    const remaining_assessments = await getAllAssessments(authHeaders);
    expect(remaining_assessments.length).toBe(0);
}