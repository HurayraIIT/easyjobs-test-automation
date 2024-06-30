import { faker } from '@faker-js/faker';
import { format, addDays, subDays } from 'date-fns';

export async function getRandomFromToDate() {
    let from_date = subDays(faker.date.past({ years: 15 }), 365);

    let random_days = faker.number.int({ min: 31, max: 2000 });
    let today = new Date();
    let to_date = addDays(from_date, random_days);

    to_date = to_date > today ? subDays(today, 1) : to_date;

    return {
        from_date: format(from_date, 'MM/dd/yyyy'),
        to_date: format(to_date, 'MM/dd/yyyy')
    };
}