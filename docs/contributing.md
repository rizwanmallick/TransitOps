# Contributing to TransitOps

Thank you for your interest in contributing to TransitOps! This document provides guidelines and information for contributors.

---

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL v14+
- Git
- VS Code (recommended)

### Recommended VS Code Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Prisma
- TypeScript Hero

---

## Development Setup

### 1. Fork the Repository
Click the "Fork" button on GitHub to create your own copy.

### 2. Clone Your Fork
```bash
git clone https://github.com/your-username/TransitOps.git
cd TransitOps
```

### 3. Create a Branch
```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests

### 4. Install Dependencies
```bash
npm install
```

### 5. Setup Environment
```bash
copy .env.example .env
# Edit .env with your PostgreSQL credentials
```

### 6. Setup Database
```bash
npx prisma db push
npx tsx --tsconfig tsconfig.json src/seed.ts
```

### 7. Start Development
```bash
npm run dev
```

---

## Code Style

### TypeScript
- Use TypeScript for all new files
- Avoid `any` type - use proper types
- Use interfaces for object shapes
- Export types that are used externally

### React Components
- Use functional components with hooks
- Keep components small and focused
- Co-locate related files in `_components/` folders
- Use Server Components by default, add `"use client"` only when needed
- For animations, import from `framer-motion` and use variants from `@/lib/animations`

### File Naming
```
components/
  ui/           # shadcn/ui components
  layout/       # Layout components (sidebar, header, page transitions)
  shared/       # Shared components (status-badge, animated wrappers)
lib/
  animations.ts # Framer Motion variants
  validations/  # Zod schemas
app/
  (dashboard)/  # Route groups
    fleet/
      _components/  # Feature-specific components
      actions.ts    # Server actions
      columns.tsx   # Table column definitions
      page.tsx      # Page component
```

### CSS/Tailwind
- Use Tailwind utility classes
- Follow the glassmorphism design system
- Use `cn()` utility for conditional classes
- Reference colors: `#0F0F17` (bg), `#22C55E` (accent), emerald/cyan gradients
- Glass classes: `.glass-card`, `.glass-card-hover`, `.glow-green`, `.gradient-text`

### Animations
- Use Framer Motion for all animations
- Import variants from `@/lib/animations`
- Use `motion` components instead of plain divs
- Add `"use client"` directive to animated components
- Use spring physics for interactive elements
- Use stagger animations for lists

---

## Making Changes

### 1. Create a Feature Branch
```bash
git checkout -b feature/add-vehicle-filter
```

### 2. Make Your Changes
- Write code following the style guide
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes
```bash
# Type check
npx tsc --noEmit

# Lint
npm run lint

# Build
npm run build
```

### 4. Commit Your Changes
```bash
git add .
git commit -m "feat: add vehicle type filter to fleet page"
```

Commit message format:
```
type(scope): description

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Code style (no logic change)
- refactor: Code refactoring
- test: Adding tests
- chore: Maintenance
```

### 5. Push to Your Fork
```bash
git push origin feature/add-vehicle-filter
```

### 6. Create a Pull Request
1. Go to the original repository
2. Click "New Pull Request"
3. Select your branch
4. Fill in the PR template
5. Submit for review

---

## Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] TypeScript compiles without errors
- [ ] All pages load correctly
- [ ] New functionality works as expected
- [ ] Animations work correctly

## Screenshots (if applicable)
Add screenshots of UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new TypeScript errors
- [ ] Framer Motion animations included (if applicable)
```

---

## Project Structure Guide

### Adding a New Page
1. Create folder in `src/app/(dashboard)/your-page/`
2. Add `page.tsx` with the page component
3. Add `actions.ts` for server actions
4. Add `columns.tsx` if using a data table
5. Add `_components/` for page-specific components
6. Update sidebar navigation in `components/layout/sidebar.tsx`

### Adding Animations to a Page
1. Import `motion` from `framer-motion`
2. Import variants from `@/lib/animations`
3. Wrap elements with `motion.div` or use animated wrappers
4. Add `"use client"` directive if not already present

### Adding a New Business Rule
1. Add validation in the relevant `actions.ts` file
2. Add Zod schema in `lib/validations/`
3. Update the form component to show errors
4. Add tests if applicable

### Adding a New shadcn Component
```bash
npx shadcn@latest add component-name
```

---

## Reporting Issues

### Bug Reports
Include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Screenshots if applicable
5. Browser/OS information

### Feature Requests
Include:
1. Problem description
2. Proposed solution
3. Alternative solutions considered
4. Additional context

---

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow the project's coding standards

---

## Questions?

If you have questions, feel free to:
1. Open an issue
2. Ask in the team chat
3. Reach out to maintainers

---

Thank you for contributing to TransitOps!
