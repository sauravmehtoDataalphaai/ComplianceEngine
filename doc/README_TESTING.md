# Testing Guide

This project includes comprehensive automation testing for the Create New Rule page.

## Test Structure

### Unit/Component Tests (Jest + React Testing Library)
- **Location**: `src/components/__tests__/`
- **File**: `RuleBuilderForm.test.tsx`
- **Coverage**: Form rendering, validation, user interactions, state management

### E2E Tests (Playwright)
- **Location**: `e2e/`
- **File**: `create-new-rule.spec.ts`
- **Coverage**: Full user flow, API interactions, navigation, error handling

## Running Tests

### Unit Tests
```bash
# Run all unit tests
npm test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### E2E Tests
```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed
```

## Test Coverage

### Component Tests (`RuleBuilderForm.test.tsx`)
- ✅ Form rendering with all fields
- ✅ Initial data loading
- ✅ Rule type selection (tightly/loosely coupled)
- ✅ Progress indicator for tightly-coupled rules
- ✅ Form validation (required fields, expression syntax)
- ✅ Save functionality
- ✅ Test functionality
- ✅ Cancel functionality
- ✅ Loading states

### E2E Tests (`create-new-rule.spec.ts`)
- ✅ Page navigation and rendering
- ✅ Loosely-coupled rule creation flow
- ✅ Tightly-coupled rule creation flow
- ✅ Form validation
- ✅ Expression validation
- ✅ API integration (save, test)
- ✅ Error handling
- ✅ Loading states
- ✅ Operator insertion
- ✅ Function insertion
- ✅ Navigation (back button)

## Test Data

Tests use mock data and API responses. The E2E tests mock API endpoints using Playwright's route interception.

## Writing New Tests

### Component Test Example
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import YourComponent from '../YourComponent';

test('should do something', async () => {
  const user = userEvent.setup();
  render(<YourComponent />);
  
  const button = screen.getByRole('button', { name: 'Click me' });
  await user.click(button);
  
  expect(screen.getByText('Expected result')).toBeInTheDocument();
});
```

### E2E Test Example
```typescript
import { test, expect } from '@playwright/test';

test('should do something', async ({ page }) => {
  await page.goto('/your-page');
  
  await page.getByRole('button', { name: 'Click me' }).click();
  
  await expect(page.getByText('Expected result')).toBeVisible();
});
```

## CI/CD Integration

Tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run unit tests
  run: npm test

- name: Run E2E tests
  run: npm run test:e2e
```

## Troubleshooting

### Tests failing due to missing mocks
- Ensure all child components are properly mocked in component tests
- Check that API routes are mocked in E2E tests

### E2E tests timing out
- Increase timeout in `playwright.config.ts`
- Ensure dev server is running before tests start
- Check network conditions

### Coverage not generating
- Run `npm run test:coverage`
- Check that files are not excluded in `jest.config.js`

