import { expect, request } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { createAssertions } from '@helpers/createAssertions';

/**
 * Generates a random title consisting of 2 to 5 lorem words followed by a random number.
 * 
 * @returns {string} A random title.
 * 
 * @example
 * // returns something like 'Lorem ipsum 123456'
 * const title = getRandomTitle();
 * console.log(title); // 'Lorem ipsum 123456'
 * 
 * @example
 * // returns something like 'Dolor sit amet consectetur 654321'
 * const title = getRandomTitle();
 * console.log(title); // 'Dolor sit amet consectetur 654321'
 */
export function getRandomTitle(): string {
    return `🤔 ${faker.lorem.words({ min: 2, max: 5 })} ${faker.number.int({ min: 1, max: 999999 })}`;
}

/**
 * Class representing different types of questions.
 */
export class QuestionType {
    /**
     * Text question type.
     * @type {{ id: number, name: string }}
     * @example
     * const textType = QuestionType.TEXT;
     * console.log(textType); // { id: 1, name: 'Text' }
     */
    static TEXT = { id: 1, name: "Text" };

    /**
     * Multiple Choice question type.
     * @type {{ id: number, name: string }}
     * @example
     * const mcqType = QuestionType.MCQ;
     * console.log(mcqType); // { id: 2, name: 'Multiple Choice' }
     */
    static MCQ = { id: 2, name: "Multiple Choice" };
}

export class QuestionSetType {
    static SCREENING = { "id": 1, "name": "Screening" };
    static QUIZ = { "id": 2, "name": "Quiz" };
    static ASSESSMENT = { "id": 3, "name": "Assessment" };
}

export class Option {
    id: number;
    title: string;

    constructor(id: number) {
        this.id = id;
        this.title = getRandomTitle();
    }
}

export class Question {
    id: number | null;
    title: string;
    type: { id: number, name: string } | string;
    options: Option[];
    answers: number[] | number;
    isValid: boolean;
    errors: string[];
    isMultiple: boolean;

    constructor(set_type: { id: number; name: string }, optionCount: number = 2) {
        this.id = null;
        this.title = `${getRandomTitle()}???`;

        let isQuiz = set_type === QuestionSetType.QUIZ;
        let random_index = faker.number.int({ min: 0, max: optionCount - 1 })

        if (isQuiz || Math.random() > 0.5) {
            this.type = QuestionType.MCQ;
            this.options = Array.from({ length: optionCount }, (_, index) => new Option(index));

            this.answers = isQuiz ? random_index : [random_index];

            this.isMultiple = true;
        } else {
            this.type = QuestionType.TEXT;
            this.isMultiple = false;
            this.options = [];
            this.answers = [];
        }
        this.isValid = false;
        this.errors = [];
    }
}

export class QuestionSet {
    id: number | null;
    set_type: { id: number; name: string };
    set_name: string;
    note: string;
    internal_note: string;
    questions: Question[];

    constructor(set_type: { id: number; name: string }, questionCount: number, optionCount: number) {
        this.id = null;
        this.internal_note = `Internal Note: 📂 ${faker.lorem.sentence()}`;
        this.note = `<p>Note: <b>${faker.lorem.sentence()}</b></p>`;
        this.set_name = getRandomTitle();
        this.set_type = set_type;
        this.questions = Array.from({ length: questionCount }, () => new Question(set_type, optionCount));
    }
}

export function getRandomQuestionSetData(type?: { id: number; name: string }, question_count?: number, option_count?: number) {
    type = type || (Math.random() > 0.5 ? QuestionSetType.QUIZ : QuestionSetType.SCREENING);
    question_count = question_count || faker.number.int({ min: 1, max: 15 });
    option_count = option_count || faker.number.int({ min: 2, max: 5 });

    const question_set_1 = new QuestionSet(type, question_count, option_count);

    return question_set_1;
}

export async function createQuestionSet(authHeaders: any, type?: { id: number; name: string }) {
    const question_set_data = type ? getRandomQuestionSetData(type) : getRandomQuestionSetData();

    const requestContext = await request.newContext();
    const response = await requestContext.post('/api/v2/company/question/group/create', {
        headers: authHeaders,
        data: question_set_data
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    // await createAssertions(body);
    expect(body.status).toBe("SUCCESS");
    expect(body.data).toEqual([]);
    expect(body.message).toBe("Saved.");

    // Find the body
    let question_set = await getAllQuestionSets(authHeaders);
    let recent_created_set: any;
    for (let set of question_set) {
        if (set.name === question_set_data.set_name) {
            recent_created_set = set;
            break;
        }
    }
    // await createAssertions(recent_created_set);
    expect(recent_created_set.id).toBeGreaterThan(0);
    expect(recent_created_set.name).toBe(question_set_data.set_name);
    expect(recent_created_set.company_id).toBeGreaterThan(0);
    expect(recent_created_set.exam_type).toStrictEqual(question_set_data.set_type);
    expect(recent_created_set.total_questions).toBe(question_set_data.questions.length);
    expect(recent_created_set.last_update).toBeTruthy();
    expect(recent_created_set.updated_by).toBeTruthy();
    expect(recent_created_set.created_by).toBeTruthy();

    return recent_created_set;
}

export async function getQuestionSetById(authHeaders: any, questionSetId: number) {
    const requestContext = await request.newContext();
    const response = await requestContext.get(`/api/v2/company/question/group/${questionSetId}`, {
        headers: authHeaders
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    // await createAssertions(body);
    expect(body.status).toBe("SUCCESS");
    expect(body.data.id).toBe(questionSetId);
    expect(body.data.set_type).toBeTruthy();
    expect(body.data.set_name).toBeTruthy();
    expect(body.data.note).toBeTruthy();
    expect(body.data.internal_note).toBeTruthy();
    expect(body.data.exam_duration).toBeNull();
    expect(body.data.marks_per_question).toBeNull();
    expect(body.message).toBeNull();

    return body.data;
}

export async function getAllQuestionSets(authHeaders: any) {
    const requestContext = await request.newContext();
    const response = await requestContext.get('/api/v2/company/question/groups', {
        headers: authHeaders
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    // await createAssertions(body);
    expect(body.status).toBe("SUCCESS");
    expect(body.data.length).toBeGreaterThanOrEqual(0);
    expect(body.message).toBeNull();

    return body.data;
}

export async function deleteQuestionSetById(authHeaders: any, questionSetId: number) {
    const requestContext = await request.newContext();
    const response = await requestContext.delete(`/api/v2/company/question/group/${questionSetId}`, {
        headers: authHeaders
    });

    expect(response.status()).toBe(200);
}

export async function deleteAllQuestionSets(authHeaders: any) {
    let question_set = await getAllQuestionSets(authHeaders);
    for (let set of question_set) {
        await deleteQuestionSetById(authHeaders, set.id);
    }
}

export async function createBulkQuestionSets(authHeaders: any, count: number) {
    for (let i = 0; i < count; i++) {
        await createQuestionSet(authHeaders);
    }
}

export async function duplicateQuestionSet(authHeaders: any, questionSetId: number) {
    const requestContext = await request.newContext();
    const response = await requestContext.get(`/api/v2/company/question/group/${questionSetId}/duplicate`, {
        headers: authHeaders
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    let original_set = await getQuestionSetById(authHeaders, questionSetId);
    // await createAssertions(body);
    expect(body.status).toBe("SUCCESS");
    expect(body.data.name).toBe(original_set.set_name);
    expect(body.data.exam_type).toBe(original_set.set_type.id);
    expect(body.data.exam_duration).toBeNull();
    expect(body.data.marks_per_question).toBeNull();
    expect(body.data.created_by).toBeGreaterThan(0);
    expect(body.data.updated_by).toBeGreaterThan(0);
    expect(body.data.deleted_at).toBeNull();
    expect(body.data.internal_note).toBe(original_set.internal_note);
    expect(body.data.note).toBe(original_set.note);
    expect(body.data.created_at).toBeTruthy();
    expect(body.data.updated_at).toBeTruthy();
    expect(body.data.id).toBeGreaterThan(original_set.id);
    expect(body.message).toBe("Question set duplicated.");

    return body.data;
}

export async function updateQuestionSet(authHeaders: any, questionSetId: number) {
    const question_set_data = getRandomQuestionSetData();

    const requestContext = await request.newContext();
    const response = await requestContext.post(`/api/v2/company/question/group/${questionSetId}/update`, {
        headers: authHeaders,
        data: question_set_data
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    // await createAssertions(body);
    expect(body.status).toBe("SUCCESS");
    expect(body.data).toEqual([]);
    expect(body.message).toBe("Saved.");

    let updated_set = await getQuestionSetById(authHeaders, questionSetId);
    //await createAssertions(updated_set);
    expect(updated_set.id).toBe(questionSetId);
    expect(updated_set.set_type.id).toBe(question_set_data.set_type.id);
    expect(updated_set.set_type.name).toBe(question_set_data.set_type.name);
    expect(updated_set.set_name).toBe(question_set_data.set_name);
    expect(updated_set.note).toBe(question_set_data.note);
    expect(updated_set.internal_note).toBe(question_set_data.internal_note);
    expect(updated_set.exam_duration).toBeNull();
    expect(updated_set.marks_per_question).toBeNull();

    return updated_set;
}

export async function getQuizMetaData(authHeaders: any) {
    const requestContext = await request.newContext();
    const response = await requestContext.get('/api/v2/job/quiz-meta-data', {
        headers: authHeaders
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body.quiz_set.length).toBeGreaterThanOrEqual(0);

    return body.quiz_set;
}

export async function getQuestionSetQuestions(authHeaders: any, id: number) {
    const requestContext = await request.newContext();
    const response = await requestContext.get(`/api/v2/question-set/${id}`, {
        headers: authHeaders
    });

    expect(response.status()).toBe(200);
    const questions = await response.json();

    return questions;
}

export async function getQuizQuestionSetQuestions(authHeaders: any, id: number) {
    const requestContext = await request.newContext();
    const response = await requestContext.get(`/api/v2/quiz-question-set/${id}`, {
        headers: authHeaders
    });

    expect(response.status()).toBe(200);
    const questions = await response.json();

    return questions;
}

export async function getScreeningQuestionSetQuestions(authHeaders: any, id: number) {
    const requestContext = await request.newContext();
    const response = await requestContext.get(`/api/v2/screening-question-set/${id}`, {
        headers: authHeaders
    });

    expect(response.status()).toBe(200);
    const questions = await response.json();

    return questions;
}