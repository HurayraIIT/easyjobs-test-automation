import fs from 'fs';

const authObjects = JSON.parse(fs.readFileSync('./.auth/auth.json', 'utf-8'));

export default authObjects;