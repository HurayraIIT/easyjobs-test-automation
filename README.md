# easyjobs-test-automation

[![Playwright Tests](https://github.com/HurayraIIT/easyjobs-test-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/HurayraIIT/easyjobs-test-automation/actions/workflows/playwright.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![GitHub last commit](https://img.shields.io/github/last-commit/HurayraIIT/easyjobs-test-automation)

End-to-end API test automation for Rasy Jobs using playwright node.js

## 🚀 Installation

_Follow the steps below to setup and run the project locally on your machine._

1. Clone the repo

```sh
git clone git@github.com:HurayraIIT/easyjobs-test-automation.git
```

2. Install NPM packages

```sh
npm install
```

3. Create the `.env` file and provide necessary details

```sh
cp .env.example .env
```

4. Update/Install playwright browsers. (optional)

```sh
npx playwright install --with-deps
```

5. Create storage state file.

```sh
mkdir .auth && echo "{}" >> .auth/auth.json
```

## 🧪 Running Tests

To run the tests:

```sh
npx playwright test
```

_For more examples, please refer to the [ Official Documentation](https://playwright.dev)_

## How to update playwright

By keeping the Playwright version up to date we will be able to use new features and test our app on the latest browser versions and catch failures before the latest browser version is released to the public.

```sh
# Update playwright
npm install -D @playwright/test@latest
```

See what version of Playwright we have by running the following command:

```sh
npx playwright --version
```

## Top contributors:

<a href="https://github.com/HurayraIIT/easyjobs-test-automation/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=HurayraIIT/easyjobs-test-automation" alt="contrib.rocks image" />
</a>