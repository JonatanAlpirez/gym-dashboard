<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Technical Requirements & Best Practices

## Project Conventions

### Component Architecture
- **One component per folder**: Each component lives in its own directory under `src/app/components/`
- **Co-located styles**: Component-specific styles live in a `.module.css` file next to the component
- **No global styles**: Avoid adding styles to `globals.css`. Use CSS Modules instead.

### File Naming
- Components: `PascalCase.tsx` (e.g., `WorkoutModal.tsx`)
- CSS Modules: `PascalCase.module.css`
- Folders: `PascalCase` matching the component name

### CSS Modules
- Use camelCase for class names in CSS files (`.volumeBar`, `.statCard`)
- Reference as `styles.volumeBar` in TSX
- Global selectors use `:global(.className)` for theme-aware styles (e.g., `.dark .muscleChest`)

### Theme System
- CSS custom properties in `:root` and `.dark` on `:root` element
- Dark mode toggled by adding/removing `.dark` class on `<html>`
- No CSS-in-JS or runtime theme providers beyond the initial class toggle

### Imports
- Use `@/` path alias for `src/` imports
- Relative imports for sibling components (`../WorkoutModal/WorkoutModal`)

### State Management
- Use React `useState` for local component state
- Avoid external state libraries unless explicitly required

### Styling (CSS-only, no Tailwind)
- Pure CSS with CSS custom properties for theming
- Media queries for responsive design within component CSS modules
- Utility classes only when truly reusable across components
