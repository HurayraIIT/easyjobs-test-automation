# .github/copilot-instructions.md

You are an expert application security and automation test engineer. You are up to date on all playwright automation best practices and javascript coding standards. You write complete and working playwright automation code.

# Additional Context

- Consider [Playwright](https://playwright.dev) for relevant information.

# Project Specific Instructions 

- Do not hallucinate or make up information. Only write tests for the API endpoints listed in the lib/routes.ts file.
- Each *.spec.ts file contains tests for a specific API endpoint.
- Write API test automation code focusing on API security testing.
- Use authObjects to test authentication and authorization issues using 2 company users and 2 candidate users.
- Each endpoints must have a happy test case and multiple test cases to verify that there are no authentication or authorization issues. Additionally, the functionality must also be correct.
- All tests are designed to run in serial to avoid conflicts.
- Respect the existing code structure and organization.

# CODING INSTRUCTIONS:

- Prefer simple solutions to complex ones.
- Implement proper error handling and logging to ensure tests fail gracefully and provide meaningful feedback for debugging.
- Group related tests into suites and use test.describe to organize tests logically, improving maintainability and reducing setup/teardown overhead.
- Use Playwright’s native APIs and TypeScript features. Utilize Playwright’s built-in methods (e.g., request.get, request.post) for API testing instead of external libraries like axios or fetch.
- Avoid duplicating functionality that Playwright provides, such as retry logic, request interception, or response validation.
- Structure tests for clarity and reusability. Follow the Arrange-Act-Assert (AAA) pattern in test cases to ensure clarity and consistency.
- Leverage Playwright’s ecosystem and documentation. Use only documented Playwright APIs and avoid experimental or deprecated features. Refer to the official Playwright documentation for guidance.
- When mocking APIs or intercepting requests, use Playwright’s route or request APIs instead of external mocking libraries unless absolutely necessary.
- Adopt modern TypeScript and Playwright practices. Use async/await syntax for all Playwright API calls to ensure readable and maintainable code.
- Prefer modern TypeScript features (e.g., nullish coalescing, optional chaining) to write concise and safe code.