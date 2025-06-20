# Actionary

A beautiful, always-on-top, floating to-do app for macOS and Linux, built with Electron and React.

## Features
- Floating, always-on-top window (top-right corner)
- Add, edit, delete, and tag tasks (To-Do, In Progress, Blocked, Completed)
- Multi-line task editing with formatting (bold, italic, underline) using keyboard shortcuts
- Modern glass-like UI with persistent storage

## Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or newer recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### 1. Clone the Repository
```
git clone <your-repo-url> actionary
cd actionary
```

### 2. Install Dependencies
```
npm install
```

### 3. Start the App
```
npm start
```

This will:
- Build the React renderer
- Launch the Electron app

### 4. Usage
- The app will appear in the top-right corner of your screen.
- Add tasks using the input at the top.
- Click a task to edit (multi-line, supports **bold**, _italic_, __underline__ with Cmd/Ctrl+B/I/U).
- Use the trash can icon to delete tasks.
- Tag tasks using the dropdown.
- All tasks are saved locally and persist between sessions.

## Platform Notes
### macOS
- Glass/vibrancy effect is enabled by default.
- The window floats above other apps and stays in the top-right.

### Linux
- The app works, but vibrancy/glass effect may not be available depending on your window manager.
- All other features work as on macOS.

## Troubleshooting
- If the app does not start, ensure you are running `npm start` from the project directory.
- For issues with transparency or always-on-top, check your OS window manager settings.

## License
MIT 
