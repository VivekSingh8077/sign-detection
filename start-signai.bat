@echo off
setlocal
cd /d "%~dp0"

echo Starting SignAI...

set "PYTHON_CMD="
py -3.12 -V >nul 2>&1 && set "PYTHON_CMD=py -3.12"
if not defined PYTHON_CMD (
    py -3.11 -V >nul 2>&1 && set "PYTHON_CMD=py -3.11"
)
if not defined PYTHON_CMD (
    echo ERROR: Python 3.11 or 3.12 is required for this project.
    echo Install Python 3.12, then run this file again.
    pause
    exit /b 1
)

if not exist ".venv\Scripts\python.exe" (
    echo Creating Python environment...
    %PYTHON_CMD% -m venv ".venv"
    if errorlevel 1 (
        echo ERROR: Could not create the Python environment.
        pause
        exit /b 1
    )
)

if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    pushd "frontend"
    call npm install
    if errorlevel 1 (
        popd
        echo ERROR: Frontend dependency installation failed.
        pause
        exit /b 1
    )
    popd
)

curl.exe --silent --fail http://127.0.0.1:8000/api/health >nul 2>&1
if errorlevel 1 (
    ".venv\Scripts\python.exe" -c "import fastapi, uvicorn, cv2, numpy, onnxruntime, mediapipe, multipart" >nul 2>&1
    if errorlevel 1 (
        echo Installing backend dependencies...
        ".venv\Scripts\python.exe" -m pip install --upgrade pip
        ".venv\Scripts\python.exe" -m pip install -r "backend\requirements.txt"
        if errorlevel 1 (
            echo ERROR: Backend dependency installation failed.
            pause
            exit /b 1
        )
    )

    echo Starting backend on http://localhost:8000
    start "SignAI Backend" cmd /k ""%CD%\.venv\Scripts\python.exe" -m uvicorn main:app --app-dir "%CD%\backend" --host 127.0.0.1 --port 8000"
) else (
    echo Backend is already running on http://localhost:8000
)

curl.exe --silent --fail http://127.0.0.1:5173/ >nul 2>&1
if errorlevel 1 (
    echo Starting frontend on http://localhost:5173
    pushd "frontend"
    start "SignAI Frontend" cmd /k "npm run dev -- --host 127.0.0.1"
    popd
) else (
    echo Frontend is already running on http://localhost:5173
)

echo Waiting for the app to become ready...
for /l %%N in (1,1,30) do (
    curl.exe --silent --fail http://127.0.0.1:8000/api/health >nul 2>&1
    if not errorlevel 1 goto open_app
    ping -n 2 127.0.0.1 >nul
)

:open_app
start "" "http://localhost:5173"
echo SignAI has been opened in your browser.
exit /b 0
