# UI Coding Standards

## Component Library

**Only shadcn/ui components are permitted for UI elements throughout this project.**

- Do NOT create custom components
- Do NOT use raw HTML elements for UI primitives (buttons, inputs, cards, dialogs, etc.)
- Do NOT use any other component library (MUI, Chakra, Radix directly, etc.)
- All UI must be built by composing shadcn/ui components

Install new shadcn/ui components as needed via:

```bash
npx shadcn@latest add <component-name>
```

## Date Formatting

All date formatting must use **date-fns**.

Dates are displayed in the following format:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

Use the `do MMM yyyy` format string with date-fns:

```ts
import { format } from "date-fns";

format(date, "do MMM yyyy"); // e.g. "1st Sep 2025"
```
