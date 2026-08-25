# BuildX Backend

## Local AI setup

Gemini is called by the backend only. Never place the API key in React code, committed source files, or frontend environment variables.

From PowerShell, open the backend directory and set the key for the current terminal session:

```powershell
cd "C:\Users\chirag\buildx\Buildx_nocode_platform\backend"
$env:GEMINI_API_KEY = "<paste-your-gemini-api-key-here>"
```

The backend uses `gemini-3.6-flash` by default. To override the model for a session:

```powershell
$env:GEMINI_MODEL_NAME = "<supported-gemini-model>"
```

Start the backend:

```powershell
npm run dev
```

For a one-off production-style start, use `npm start` instead.

## Start the frontend

In a second PowerShell terminal:

```powershell
cd "C:\Users\chirag\buildx\Buildx_nocode_platform\frontend"
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

## Verify the flow

1. Log in or create an account in BuildX.
2. Open the Builder and submit an AI prompt.
3. Confirm generated components appear on the canvas.
4. Save the project and open its preview.

If Gemini is unavailable or returns invalid JSON, BuildX shows an error and leaves the existing components unchanged.
