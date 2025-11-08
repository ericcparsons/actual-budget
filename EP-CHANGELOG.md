# EP Custom Fork - Changelog

## Custom Features

This fork adds two new metrics to the envelope budget summary:

1. **Underfunded Amount** - Shows the total money needed to meet all goal templates for the month (displayed in red if > 0)
2. **Total Targets** - Shows the cumulative sum of all goal templates for the month

Both metrics update automatically in real-time when you apply or clear templates.

## Technical Implementation

### Backend Changes

**`packages/loot-core/src/server/budget/goal-template.ts`**
- Added `getTotalUnderfunded()` - Calculates total money needed to reach all goal templates
- Added `getTotalTargets()` - Calculates cumulative sum of all goal templates
- Both functions iterate through categories with templates and aggregate values

**`packages/loot-core/src/server/budget/app.ts`**
- Registered `budget/get-total-underfunded` API method (line 62-63, 165)
- Registered `budget/get-total-targets` API method (line 62-63, 166)

### Frontend Changes

**`packages/desktop-client/src/components/budget/envelope/budgetsummary/UnderfundedAmount.tsx`** (New)
- Created `useTemplateAmounts()` custom hook
- Fetches underfunded and total targets via API calls
- Watches `totalBudgeted` spreadsheet value for real-time updates
- Re-fetches data when month changes or budgeted amounts change

**`packages/desktop-client/src/components/budget/envelope/budgetsummary/TotalsList.tsx`**
- Integrated `useTemplateAmounts()` hook
- Added "Underfunded" row with conditional red styling
- Added "Total Targets" row
- Added tooltips explaining each metric
- Passes month prop for calculations

**`packages/desktop-client/src/components/budget/envelope/budgetsummary/BudgetSummary.tsx`**
- Passed `month` prop to TotalsList component

## Branch Information

- **Main branch:** Points to upstream actualbudget/actual
- **Custom branch:** `ep-feat` (contains all custom features)
- **Deployed branch:** `ep-feat`

## Version History

### 2025-01-08 - Initial Custom Features
- Added underfunded amount calculation
- Added total targets calculation
- Integrated real-time updates via spreadsheet watchers
- Deployed to Fly.io at parsons-budget.fly.dev
