import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RuleBuilderForm, { type RuleFormData } from '../RuleBuilderForm'

// Mock child components
jest.mock('../ExpressionEditor', () => {
  return function MockExpressionEditor({ value, onChange, onValidate }: any) {
    return (
      <div data-testid="expression-editor">
        <textarea
          data-testid="expression-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter expression..."
        />
        <button
          data-testid="validate-button"
          onClick={() => onValidate()}
        >
          Validate
        </button>
      </div>
    )
  }
})

jest.mock('../OperatorsPanel', () => {
  return function MockOperatorsPanel({ onInsertOperator }: any) {
    return (
      <div data-testid="operators-panel">
        <button onClick={() => onInsertOperator('+')}>+</button>
        <button onClick={() => onInsertOperator('-')}>-</button>
        <button onClick={() => onInsertOperator('*')}>*</button>
      </div>
    )
  }
})

jest.mock('../FunctionsLibrary', () => {
  return function MockFunctionsLibrary({ onInsertFunction }: any) {
    return (
      <div data-testid="functions-library">
        <button onClick={() => onInsertFunction('SUM()')}>SUM</button>
        <button onClick={() => onInsertFunction('AVG()')}>AVG</button>
      </div>
    )
  }
})

jest.mock('../RuleTypeSelector', () => {
  return function MockRuleTypeSelector({ value, onChange }: any) {
    return (
      <div data-testid="rule-type-selector">
        <button
          data-testid="tightly-coupled-btn"
          onClick={() => onChange('tightly-coupled')}
          className={value === 'tightly-coupled' ? 'active' : ''}
        >
          Tightly Coupled
        </button>
        <button
          data-testid="loosely-coupled-btn"
          onClick={() => onChange('loosely-coupled')}
          className={value === 'loosely-coupled' ? 'active' : ''}
        >
          Loosely Coupled
        </button>
      </div>
    )
  }
})

jest.mock('../DataSourceSelector', () => {
  return function MockDataSourceSelector({ value, onChange }: any) {
    return (
      <div data-testid="data-source-selector">
        <select
          data-testid="data-source-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select data source</option>
          <option value="source1">Data Source 1</option>
          <option value="source2">Data Source 2</option>
        </select>
      </div>
    )
  }
})

jest.mock('../TableObjectSelector', () => {
  return function MockTableObjectSelector({ dataSource, selectedObject, onSelectObject }: any) {
    if (!dataSource) return null
    return (
      <div data-testid="table-object-selector">
        <select
          data-testid="table-object-select"
          value={selectedObject || ''}
          onChange={(e) => onSelectObject(e.target.value)}
        >
          <option value="">Select table/view</option>
          <option value="table1">Table 1</option>
          <option value="table2">Table 2</option>
        </select>
      </div>
    )
  }
})

jest.mock('../ColumnSelector', () => {
  return function MockColumnSelector({ selectedColumns, onColumnsChange }: any) {
    return (
      <div data-testid="column-selector">
        <input
          type="checkbox"
          data-testid="column-checkbox-1"
          checked={selectedColumns?.includes('col1')}
          onChange={(e) => {
            const newCols = e.target.checked
              ? [...(selectedColumns || []), 'col1']
              : (selectedColumns || []).filter((c: string) => c !== 'col1')
            onColumnsChange(newCols)
          }}
        />
        <label>Column 1</label>
      </div>
    )
  }
})

describe('RuleBuilderForm', () => {
  const mockOnSave = jest.fn()
  const mockOnCancel = jest.fn()
  const mockOnTest = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Form Rendering', () => {
    it('renders the form with all required fields', () => {
      render(
        <RuleBuilderForm
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          onTest={mockOnTest}
        />
      )

      expect(screen.getByTestId('rule-builder-form')).toBeInTheDocument()
      expect(screen.getByTestId('back-button')).toBeInTheDocument()
      expect(screen.getByText('Create New Rule')).toBeInTheDocument()
      expect(screen.getByTestId('test-rule-button')).toBeInTheDocument()
      expect(screen.getByTestId('save-rule-button')).toBeInTheDocument()
    })

    it('renders with initial data when provided', () => {
      const initialData: Partial<RuleFormData> = {
        name: 'Test Rule',
        description: 'Test Description',
        category: 'Risk',
        severity: 'hard',
        expression: 'SUM() > 100',
      }

      render(
        <RuleBuilderForm
          initialData={initialData}
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          onTest={mockOnTest}
        />
      )

      expect(screen.getByDisplayValue('Test Rule')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument()
    })
  })

  describe('Rule Type Selection', () => {
    it('defaults to tightly-coupled rule type', () => {
      render(
        <RuleBuilderForm
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          onTest={mockOnTest}
        />
      )

      expect(screen.getByTestId('rule-type-selector')).toBeInTheDocument()
    })

    it('switches to loosely-coupled when selected', async () => {
      const user = userEvent.setup()
      render(
        <RuleBuilderForm
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          onTest={mockOnTest}
        />
      )

      const looselyCoupledBtn = screen.getByTestId('loosely-coupled-btn')
      await user.click(looselyCoupledBtn)

      // Loosely-coupled should not show data configuration tabs
      expect(screen.queryByText('Data Configuration')).not.toBeInTheDocument()
    })
  })

  describe('Tightly-Coupled Rule Flow', () => {
    it('shows progress indicator for tightly-coupled rules', () => {
      render(
        <RuleBuilderForm
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          onTest={mockOnTest}
        />
      )

      expect(screen.getByText('Progress')).toBeInTheDocument()
      expect(screen.getByText('0/4')).toBeInTheDocument()
    })

    it('requires data source and table object for tightly-coupled rules', async () => {
      const user = userEvent.setup()
      render(
        <RuleBuilderForm
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          onTest={mockOnTest}
        />
      )

      // Fill in name and expression
      const nameInput = screen.getByTestId('input-rule-name')
      await user.type(nameInput, 'Test Rule')

      // Save button should be disabled
      const saveButton = screen.getByTestId('save-rule-button')
      expect(saveButton).toBeDisabled()
    })

    it('enables save button when all required fields are filled', async () => {
      const user = userEvent.setup()
      render(
        <RuleBuilderForm
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          onTest={mockOnTest}
        />
      )

      // Select data source
      const dataSourceSelect = screen.getByTestId('data-source-select')
      await user.selectOptions(dataSourceSelect, 'source1')

      // Select table object
      await waitFor(() => {
        const tableSelect = screen.getByTestId('table-object-select')
        expect(tableSelect).toBeInTheDocument()
      })
      const tableSelect = screen.getByTestId('table-object-select')
      await user.selectOptions(tableSelect, 'table1')

      // Switch to rule tab
      const ruleTab = screen.getByText('Rule Expression')
      await user.click(ruleTab)

      // Fill in name
      const nameInput = screen.getByTestId('input-rule-name')
      await user.type(nameInput, 'Test Rule')

      // Fill in expression
      const expressionInput = screen.getByTestId('expression-input')
      await user.type(expressionInput, 'SUM(col1) > 100')

      // Validate expression
      const validateButton = screen.getByTestId('validate-button')
      await user.click(validateButton)

      // Save button should be enabled
      await waitFor(() => {
        const saveButton = screen.getByTestId('save-rule-button')
        expect(saveButton).not.toBeDisabled()
      })
    })
  })

  describe('Loosely-Coupled Rule Flow', () => {
    it('does not require data source for loosely-coupled rules', async () => {
      const user = userEvent.setup()
      render(
        <RuleBuilderForm
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          onTest={mockOnTest}
        />
      )

      // Switch to loosely-coupled
      const looselyCoupledBtn = screen.getByTestId('loosely-coupled-btn')
      await user.click(looselyCoupledBtn)

      // Fill in name
      const nameInput = screen.getByTestId('input-rule-name')
      await user.type(nameInput, 'Test Rule')

      // Fill in expression
      const expressionInput = screen.getByTestId('expression-input')
      await user.type(expressionInput, 'SUM() > 100')

      // Validate expression
      const validateButton = screen.getByTestId('validate-button')
      await user.click(validateButton)

      // Save button should be enabled
      await waitFor(() => {
        const saveButton = screen.getByTestId('save-rule-button')
        expect(saveButton).not.toBeDisabled()
      })
    })
  })

  describe('Form Validation', () => {
    it('shows error when rule name is empty', async () => {
      const user = userEvent.setup()
      render(
        <RuleBuilderForm
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          onTest={mockOnTest}
        />
      )

      // Try to submit without name
      const saveButton = screen.getByTestId('save-rule-button')
      expect(saveButton).toBeDisabled()

      // Error message should be visible
      expect(screen.getByText(/Rule name is required/i)).toBeInTheDocument()
    })

    it('validates expression before saving', async () => {
      const user = userEvent.setup()
      render(
        <RuleBuilderForm
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          onTest={mockOnTest}
        />
      )

      // Switch to loosely-coupled for simpler flow
      const looselyCoupledBtn = screen.getByTestId('loosely-coupled-btn')
      await user.click(looselyCoupledBtn)

      // Fill in name
      const nameInput = screen.getByTestId('input-rule-name')
      await user.type(nameInput, 'Test Rule')

      // Fill in invalid expression (mismatched parentheses)
      const expressionInput = screen.getByTestId('expression-input')
      await user.type(expressionInput, 'SUM(col1 > 100')

      // Validate expression
      const validateButton = screen.getByTestId('validate-button')
      await user.click(validateButton)

      // Save button should still be disabled
      await waitFor(() => {
        const saveButton = screen.getByTestId('save-rule-button')
        expect(saveButton).toBeDisabled()
      })
    })
  })

  describe('Save Functionality', () => {
    it('calls onSave with correct form data', async () => {
      const user = userEvent.setup()
      render(
        <RuleBuilderForm
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          onTest={mockOnTest}
        />
      )

      // Switch to loosely-coupled for simpler flow
      const looselyCoupledBtn = screen.getByTestId('loosely-coupled-btn')
      await user.click(looselyCoupledBtn)

      // Fill in form
      const nameInput = screen.getByTestId('input-rule-name')
      await user.type(nameInput, 'Test Rule')

      const descriptionInput = screen.getByLabelText(/description/i)
      await user.type(descriptionInput, 'Test Description')

      const expressionInput = screen.getByTestId('expression-input')
      await user.type(expressionInput, 'SUM() > 100')

      // Validate expression
      const validateButton = screen.getByTestId('validate-button')
      await user.click(validateButton)

      // Submit form
      await waitFor(() => {
        const saveButton = screen.getByTestId('save-rule-button')
        expect(saveButton).not.toBeDisabled()
      })

      const saveButton = screen.getByTestId('save-rule-button')
      await user.click(saveButton)

      await waitFor(() => {
        expect(mockOnSave).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Test Rule',
            description: 'Test Description',
            expression: 'SUM() > 100',
            ruleType: 'loosely-coupled',
          })
        )
      })
    })
  })

  describe('Test Functionality', () => {
    it('calls onTest with expression when test button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <RuleBuilderForm
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          onTest={mockOnTest}
        />
      )

      // Switch to loosely-coupled
      const looselyCoupledBtn = screen.getByTestId('loosely-coupled-btn')
      await user.click(looselyCoupledBtn)

      // Fill in expression
      const expressionInput = screen.getByTestId('expression-input')
      await user.type(expressionInput, 'SUM() > 100')

      // Click test button
      const testButton = screen.getByTestId('test-rule-button')
      await user.click(testButton)

      expect(mockOnTest).toHaveBeenCalledWith('SUM() > 100')
    })

    it('disables test button when expression is empty', () => {
      render(
        <RuleBuilderForm
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          onTest={mockOnTest}
        />
      )

      const testButton = screen.getByTestId('test-rule-button')
      expect(testButton).toBeDisabled()
    })
  })

  describe('Cancel Functionality', () => {
    it('calls onCancel when back button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <RuleBuilderForm
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          onTest={mockOnTest}
        />
      )

      const backButton = screen.getByTestId('back-button')
      await user.click(backButton)

      expect(mockOnCancel).toHaveBeenCalled()
    })
  })

  describe('Loading States', () => {
    it('shows loading state on save button when isSaving is true', () => {
      render(
        <RuleBuilderForm
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          onTest={mockOnTest}
          isSaving={true}
        />
      )

      const saveButton = screen.getByTestId('save-rule-button')
      expect(saveButton).toBeDisabled()
      expect(screen.getByText(/Saving/i)).toBeInTheDocument()
    })

    it('shows loading state on test button when isTesting is true', () => {
      render(
        <RuleBuilderForm
          onSave={mockOnSave}
          onCancel={mockOnCancel}
          onTest={mockOnTest}
          isTesting={true}
        />
      )

      const testButton = screen.getByTestId('test-rule-button')
      expect(testButton).toBeDisabled()
      expect(screen.getByText(/Testing/i)).toBeInTheDocument()
    })
  })
})

