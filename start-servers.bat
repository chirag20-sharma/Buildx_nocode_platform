@echo off
echo Starting BuildX Development Servers...

echo.
echo Starting MongoDB...
start "MongoDB" mongod --dbpath C:\data\db

echo.
echo Waiting for MongoDB to start...
timeout /t 3 /nobreak > nul

echo.
echo Starting Backend Server...
start "Backend" cmd /k "cd backend && npm run dev"

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo.
echo Starting Frontend Server...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo All servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause