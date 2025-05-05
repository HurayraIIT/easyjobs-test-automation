# EasyJobs Test Automation 🤖

<div align="center">

[![Playwright Tests](https://github.com/HurayraIIT/easyjobs-test-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/HurayraIIT/easyjobs-test-automation/actions/workflows/playwright.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![GitHub last commit](https://img.shields.io/github/last-commit/HurayraIIT/easyjobs-test-automation)
[![Powered by Playwright](https://img.shields.io/badge/Powered%20by-Playwright-45ba4b.svg)](https://playwright.dev)
[![Node.js CI](https://img.shields.io/badge/CI-Node.js-43853d.svg)](https://nodejs.org)

</div>

## 📝 Overview

End-to-end API test automation suite for EasyJobs platform built with Playwright. This project provides comprehensive API testing coverage with automated CI/CD integration.

### Key Features

- 🔄 Automated CI/CD pipeline
- 📊 HTML test reports
- 🔔 Slack notifications
- ⚡ Super fast test execution
- 🔑 Environment-based configuration

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Git
- A code editor (VS Code recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:HurayraIIT/easyjobs-test-automation.git
   cd easyjobs-test-automation
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up authentication storage**
   ```bash
   mkdir .auth && echo "{}" >> .auth/auth.json
   ```

5. **Install Playwright browsers** (optional)
   ```bash
   npx playwright install --with-deps
   ```

## 🧪 Running Tests

### Run all tests
```bash
npx playwright test
```

### Run specific test file
```bash
npx playwright test tests/example.spec.ts
```

### View last HTML report
```bash
npx playwright show-report
```

## 🔄 Keeping Playwright Updated

Stay up to date with the latest Playwright features and browser versions:

```bash
# Check current version
npx playwright --version

# Update Playwright
npm install -D @playwright/test@latest
```

## 👥 Contributors

<div align="center">
  <a href="https://github.com/HurayraIIT/easyjobs-test-automation/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=HurayraIIT/easyjobs-test-automation" alt="contributors" />
  </a>
</div>

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Made with ❤️ by the EasyJobs Test Automation Team
</div>