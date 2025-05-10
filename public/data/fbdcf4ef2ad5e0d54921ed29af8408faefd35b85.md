# Test info

- Name: /api/v2/company/setting/beta-feature GET requests @company >> GET with valid credentials but another company ID
- Location: /home/runner/work/easyjobs-test-automation/easyjobs-test-automation/tests/api-v2/company/settings/beta-feature.get.spec.ts:37:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 471
Received: 412
    at /home/runner/work/easyjobs-test-automation/easyjobs-test-automation/tests/api-v2/company/settings/beta-feature.get.spec.ts:47:40
```

# Test source

```ts
   1 | //GET: /api/v2/company/setting/beta-feature
   2 |
   3 | import { test, expect } from '@playwright/test';
   4 | import authObjects from '@datafactory/auth';
   5 | import { createAssertions } from "@helpers/createAssertions";
   6 |
   7 | test.describe("/api/v2/company/setting/beta-feature GET requests @company", async () => {
   8 |     test("GET with valid credentials @happy", async ({ request }) => {
   9 |         // Get the beta features
  10 |         const response = await request.get(`/api/v2/company/setting/beta-feature`, {
  11 |             headers: authObjects.companyOneAuthHeaders
  12 |         });
  13 |
  14 |         expect.soft(response.status()).toBe(200);
  15 |
  16 |         const body = await response.json();
  17 |         // await createAssertions(body);
  18 |         expect(body.status).toBe("SUCCESS");
  19 |         expect(body.data.enabled_candidate_tiny_icon).toBe(true);
  20 |         expect(body.data.enabled_candidate_card_opacity).toBe(true);
  21 |         expect(body.message).toBeNull();
  22 |     });
  23 |
  24 |     test("GET with invalid credentials", async ({ request }) => {
  25 |         const response = await request.get(`/api/v2/company/setting/beta-feature`, {
  26 |             headers: {
  27 |                 "Accept": "application/json",
  28 |             }
  29 |         });
  30 |
  31 |         expect.soft(response.status()).toBe(401);
  32 |
  33 |         const body = await response.json();
  34 |         expect(body.message).toBe("Unauthenticated.");
  35 |     });
  36 |
  37 |     test("GET with valid credentials but another company ID", async ({ request }) => {
  38 |         // Company two should not be able to access data from company one
  39 |         const maliciousHeaders = authObjects.companyTwoAuthHeaders;
  40 |         maliciousHeaders['Company-Id'] = authObjects.companyOneAuthHeaders['Company-Id'];
  41 |         // maliciousHeaders['State-Version'] = authObjects.companyOneAuthHeaders['State-Version'];
  42 |
  43 |         const response = await request.get(`/api/v2/company/setting/beta-feature`, {
  44 |             headers: maliciousHeaders
  45 |         });
  46 |
> 47 |         expect.soft(response.status()).toBe(471);
     |                                        ^ Error: expect(received).toBe(expected) // Object.is equality
  48 |
  49 |         const body = await response.json();
  50 |         // await createAssertions(body);
  51 |         expect(body.status).toBe("FAILED");
  52 |         expect(body.data).toEqual([]);
  53 |         expect(body.message).toBe("Something went wrong.");
  54 |     });
  55 |
  56 |     // TODO: Report Issue
  57 |     // test("GET with candidate auth", async ({ request }) => {
  58 |     //     const response = await request.get(`/api/v2/company/setting/beta-feature`, {
  59 |     //         headers: authObjects.candidateOneAuthHeaders
  60 |     //     });
  61 |
  62 |     //     expect.soft(response.status()).toBe(480);
  63 |
  64 |     //     const body = await response.json();
  65 |
  66 |     //     // await createAssertions(body);
  67 |     //     expect(body.status).toBe("failed");
  68 |     //     expect(body.data).toEqual([]);
  69 |     //     expect(body.message).toBe("You do not have access permissions.");
  70 |     // });
  71 | });
```