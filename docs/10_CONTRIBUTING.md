# Contributing

## Coding Standards

- Write clear, intention-driven code.
- Keep functions small and focused.
- Prefer explicitness over cleverness.
- Use TypeScript types for public contracts.

## Naming Conventions

- Use descriptive names for files and symbols.
- Keep component and system names aligned with their purpose.
- Use PascalCase for components and systems.

## Folder Conventions

- `src/core`: shared engine systems and utilities.
- `src/features`: visual content domains.
- `docs`: vision, guidelines, and architectural reference.
- Keep feature logic isolated.

## Git Workflow

- Branch from `main` for every task.
- Use descriptive branch names.
- Keep commits focused and reviewable.

## Pull Request Expectations

- Include a short summary of the change.
- Reference the related story or sprint.
- Ensure `npm run build` passes.
- Keep PRs small when possible.

## Code Review Rules

- Review for intent and maintainability.
- Verify no architecture or story redesigns slip in.
- Confirm performance and visual quality remain aligned.
- Ask if a change affects storytelling or experience.
