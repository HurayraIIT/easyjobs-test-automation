//
// https://app.easyjobs.dev/api/v2/degree?keyword=
//

const degree = {
  "id": 17,
  "education_level_id": 2,
  "name": "Associate of Engineering Science",
  "short_name": "AES"
};

//
// https://app.easyjobs.dev/api/v2/education-level?keyword=
//

const education_level = {
  "id": 33,
  "name": "Diploma In Computer Science",
  "short_name": "DIP"
};

//
// https://app.easyjobs.dev/api/v2/country
//

const country = {
  "id": 18,
  "sort_name": "BD",
  "name": "Bangladesh",
  "phone_code": "880",
  "nationality": "Bangladeshi"
};

//
// https://app.easyjobs.dev/api/v2/state/18
//

const state = {
  "id": 348,
  "name": "Dhaka"
};

//
// https://app.easyjobs.dev/api/v2/city/18/348
//

const city = {
  "id": 48397,
  "name": "Mirpur DOHS"
};

//
// https://app.easyjobs.dev/api/v2/job/category
//

const category = { "id": 897, "name": "Accounting" };

//
// https://app.easyjobs.dev/api/v2/job/skill
//

const skills = [
  {
    "id": 485,
    "name": "redis"
  },
  {
    "id": 155,
    "name": "Responsible"
  },
  {
    "id": 543,
    "name": "Rest API"
  },
];

export { degree, education_level, country, state, city, category, skills };