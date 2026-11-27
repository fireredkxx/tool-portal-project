# CLAUDE.md

## Tech Stack

- Plain HTML, CSS, and JavaScript only.
- No frameworks, no build step. Files must open directly in a browser.

## Project Structure

- `index.html` – portal homepage (grid of tool cards)
- `css/style.css` – shared styles and the light/dark colour values
- `js/theme.js` – shared light/dark theme toggle (loaded in `<head>` on every page)
- `tools/<tool-name>/index.html` – one folder per tool
  - `tools/tool-1/` – placeholder tool page, used to test navigation
- `README.md` – basic project readme
- `CLAUDE.md` – this file

Update this section as files and folders are added.

## Key Requirements

1. Every page must be responsive and work on desktop, tablet and phone.
2. Users can toggle between a light and a dark theme. The default is the light theme.
3. Text must stay easy to read, with good contrast, in both the light and the dark theme.

## Feature Plan

A web portal where STEM students try out small web tools. Tools come from several subjects (mixed STEM).

### Portal structure

- **Homepage** (`index.html`): a grid of tool cards. Each card shows the tool name, a subject tag (e.g. Electrical Engineering) and a one-line description.
- **Opening a tool:** clicking a card opens that tool's own page.
- **Getting back:** every tool page has a header link back to the homepage. The theme toggle is in the header on every page.
- **Adding a tool later:** create a folder `tools/<tool-name>/` with its own `index.html` (and a script in `js/` if needed), then add a card for it on the homepage. Shared styles (`css/style.css`) and the theme toggle (`js/theme.js`) are reused, not copied.

### Phases

**Phase 1 – Portal + first tool**
- [x] Homepage with the tool card grid, header and theme toggle. A placeholder card, "Tool 1 – coming soon" (`tools/tool-1/`), checks that opening a tool and coming back works. Styling is plain and neutral for now.
- [ ] Ohm's law calculator: enter any two of voltage, current and resistance. It shows the missing value plus power, with worked steps (e.g. `I = V / R = 12 V / 4 Ω = 3 A`) and clear error messages.

**Phase 2 – More tools**
- Add a few tools from other subjects (e.g. chemistry, biology), using the same folder pattern.

**Phase 3 – Finding tools**
- Filter or group the homepage cards by subject once there are enough tools to need it.

## Rules for Claude

- Explain technical terms in plain language.
- Ask before making big changes.
- Ask rather than guess when something is unclear.
