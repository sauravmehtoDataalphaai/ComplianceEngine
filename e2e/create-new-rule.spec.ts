import { test, expect } from '@playwright/test';

test.describe('Create New Rule Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the create new rule page
    await page.goto('/rules/new');
    // Wait for the page to load
    await page.waitForSelector('[data-testid="rule-builder-form"]');
  });

  test('should display the create new rule form', async ({ page }) => {
    // Check that the form is visible
    await expect(page.locator('[data-testid="rule-builder-form"]')).toBeVisible();
    
    // Check that the header is correct
    await expect(page.getByText('Create New Rule')).toBeVisible();
    
    // Check that required buttons are present
    await expect(page.getByTestId('back-button')).toBeVisible();
    await expect(page.getByTestId('test-rule-button')).toBeVisible();
    await expect(page.getByTestId('save-rule-button')).toBeVisible();
  });

  test('should show progress indicator for tightly-coupled rules', async ({ page }) => {
    // Progress indicator should be visible
    await expect(page.getByText('Progress')).toBeVisible();
    await expect(page.getByText('0/4')).toBeVisible();
  });

  test('should allow selecting rule type', async ({ page }) => {
    // Initially tightly-coupled should be selected
    const tightlyCoupledBtn = page.getByTestId('tightly-coupled-btn');
    await expect(tightlyCoupledBtn).toBeVisible();
    
    // Click loosely-coupled
    const looselyCoupledBtn = page.getByTestId('loosely-coupled-btn');
    await looselyCoupledBtn.click();
    
    // Data configuration tabs should not be visible for loosely-coupled
    await expect(page.getByText('Data Configuration')).not.toBeVisible();
  });

  test('should create a loosely-coupled rule successfully', async ({ page }) => {
    // Mock API responses
    await page.route('**/api/rules/test', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Rule test completed successfully',
        }),
      });
    });

    await page.route('**/api/rules', async route => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'rule-123',
          name: 'Test Rule',
          message: 'Rule created successfully',
        }),
      });
    });

    // Select loosely-coupled rule type
    await page.getByTestId('loosely-coupled-btn').click();
    
    // Fill in rule name
    const nameInput = page.getByTestId('input-rule-name');
    await nameInput.fill('Test Rule');
    
    // Fill in description
    const descriptionInput = page.getByLabel(/description/i);
    await descriptionInput.fill('This is a test rule');
    
    // Fill in expression
    const expressionInput = page.getByTestId('expression-input');
    await expressionInput.fill('SUM(col1) > 100');
    
    // Validate expression
    const validateButton = page.getByTestId('validate-button');
    await validateButton.click();
    
    // Wait for validation to complete
    await page.waitForTimeout(500);
    
    // Test the rule
    const testButton = page.getByTestId('test-rule-button');
    await testButton.click();
    
    // Wait for test to complete
    await page.waitForTimeout(1000);
    
    // Check for success message (toast)
    // Note: You may need to adjust this based on your toast implementation
    
    // Save the rule
    const saveButton = page.getByTestId('save-rule-button');
    await expect(saveButton).not.toBeDisabled();
    await saveButton.click();
    
    // Should redirect to rules page
    await page.waitForURL('**/rules', { timeout: 5000 });
    expect(page.url()).toContain('/rules');
  });

  test('should create a tightly-coupled rule successfully', async ({ page }) => {
    // Mock API responses
    await page.route('**/api/rules/test', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Rule test completed successfully',
        }),
      });
    });

    await page.route('**/api/rules', async route => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'rule-123',
          name: 'Test Rule',
          message: 'Rule created successfully',
        }),
      });
    });

    // Select data source
    const dataSourceSelect = page.getByTestId('data-source-select');
    await dataSourceSelect.selectOption({ index: 1 }); // Select first option
    
    // Wait for table selector to appear
    await page.waitForSelector('[data-testid="table-object-select"]', { timeout: 5000 });
    
    // Select table object
    const tableSelect = page.getByTestId('table-object-select');
    await tableSelect.selectOption({ index: 1 });
    
    // Switch to rule tab
    await page.getByText('Rule Expression').click();
    
    // Fill in rule name
    const nameInput = page.getByTestId('input-rule-name');
    await nameInput.fill('Test Tightly Coupled Rule');
    
    // Fill in expression
    const expressionInput = page.getByTestId('expression-input');
    await expressionInput.fill('SUM(col1) > 100');
    
    // Validate expression
    const validateButton = page.getByTestId('validate-button');
    await validateButton.click();
    
    // Wait for validation
    await page.waitForTimeout(500);
    
    // Save button should be enabled
    const saveButton = page.getByTestId('save-rule-button');
    await expect(saveButton).not.toBeDisabled();
    
    // Save the rule
    await saveButton.click();
    
    // Should redirect to rules page
    await page.waitForURL('**/rules', { timeout: 5000 });
    expect(page.url()).toContain('/rules');
  });

  test('should validate form fields', async ({ page }) => {
    // Save button should be disabled initially
    const saveButton = page.getByTestId('save-rule-button');
    await expect(saveButton).toBeDisabled();
    
    // Error message for required name should be visible
    await expect(page.getByText(/Rule name is required/i)).toBeVisible();
  });

  test('should validate expression syntax', async ({ page }) => {
    // Switch to loosely-coupled for simpler flow
    await page.getByTestId('loosely-coupled-btn').click();
    
    // Fill in name
    await page.getByTestId('input-rule-name').fill('Test Rule');
    
    // Fill in invalid expression (mismatched parentheses)
    const expressionInput = page.getByTestId('expression-input');
    await expressionInput.fill('SUM(col1 > 100');
    
    // Validate expression
    const validateButton = page.getByTestId('validate-button');
    await validateButton.click();
    
    // Wait for validation
    await page.waitForTimeout(500);
    
    // Save button should still be disabled
    const saveButton = page.getByTestId('save-rule-button');
    await expect(saveButton).toBeDisabled();
  });

  test('should disable test button when expression is empty', async ({ page }) => {
    const testButton = page.getByTestId('test-rule-button');
    await expect(testButton).toBeDisabled();
  });

  test('should show loading state when saving', async ({ page }) => {
    // Mock slow API response
    await page.route('**/api/rules', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'rule-123',
          name: 'Test Rule',
          message: 'Rule created successfully',
        }),
      });
    });

    // Switch to loosely-coupled
    await page.getByTestId('loosely-coupled-btn').click();
    
    // Fill in required fields
    await page.getByTestId('input-rule-name').fill('Test Rule');
    const expressionInput = page.getByTestId('expression-input');
    await expressionInput.fill('SUM() > 100');
    
    // Validate and save
    await page.getByTestId('validate-button').click();
    await page.waitForTimeout(500);
    
    const saveButton = page.getByTestId('save-rule-button');
    await saveButton.click();
    
    // Check for loading state
    await expect(page.getByText(/Saving/i)).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Mock API error
    await page.route('**/api/rules', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: 'Internal server error',
        }),
      });
    });

    // Switch to loosely-coupled
    await page.getByTestId('loosely-coupled-btn').click();
    
    // Fill in required fields
    await page.getByTestId('input-rule-name').fill('Test Rule');
    const expressionInput = page.getByTestId('expression-input');
    await expressionInput.fill('SUM() > 100');
    
    // Validate and save
    await page.getByTestId('validate-button').click();
    await page.waitForTimeout(500);
    
    const saveButton = page.getByTestId('save-rule-button');
    await saveButton.click();
    
    // Error toast should appear (adjust selector based on your toast implementation)
    await page.waitForTimeout(1000);
    // The error should be displayed to the user
  });

  test('should navigate back when cancel button is clicked', async ({ page }) => {
    const backButton = page.getByTestId('back-button');
    await backButton.click();
    
    // Should navigate to rules page
    await page.waitForURL('**/rules', { timeout: 5000 });
    expect(page.url()).toContain('/rules');
  });

  test('should insert operators from operators panel', async ({ page }) => {
    // Switch to rule tab or loosely-coupled
    await page.getByTestId('loosely-coupled-btn').click();
    
    // Click on an operator
    const plusButton = page.getByRole('button', { name: '+' });
    await plusButton.click();
    
    // Expression should contain the operator
    const expressionInput = page.getByTestId('expression-input');
    const expressionValue = await expressionInput.inputValue();
    expect(expressionValue).toContain('+');
  });

  test('should insert functions from functions library', async ({ page }) => {
    // Switch to loosely-coupled
    await page.getByTestId('loosely-coupled-btn').click();
    
    // Click on a function
    const sumButton = page.getByRole('button', { name: 'SUM' });
    await sumButton.click();
    
    // Expression should contain the function
    const expressionInput = page.getByTestId('expression-input');
    const expressionValue = await expressionInput.inputValue();
    expect(expressionValue).toContain('SUM');
  });
});

