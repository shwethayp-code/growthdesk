# GrowthDesk — Documentation

The public-facing project documentation lives here in plain Markdown so it renders directly on GitHub.

## Read these

- **[`project-brief.md`](project-brief.md)** — what GrowthDesk is, who it's for, what's in it, and what's coming next.
- **[`legaltech-api-spec.md`](legaltech-api-spec.md)** — full integration spec for the optional compliance / DPDP API.
- **[`screenshots/`](screenshots/)** — banner + selected visuals for the README.

## Before pushing to GitHub

If the following original-format files are still present alongside the Markdown, **delete them before publishing the repo publicly** — they contain teammate names, internal strategy notes, and other context that should not be public:

```
docs/project-brief.docx
docs/legaltech-api-spec.docx
docs/pm-presentation.pdf
```

The `.md` versions in this folder are the cleaned, public-safe replacements — same structure and information, with all personal data removed. You only need the `.md` files in the published repo.

To delete them on Windows from File Explorer, just select all three and hit Shift+Delete. Or from a terminal in the project root:

```bash
rm docs/project-brief.docx docs/legaltech-api-spec.docx docs/pm-presentation.pdf
```
