@echo off
setlocal enabledelayedexpansion
title Git Auto Update - SW Lal Kuthi

echo ======================================================
echo          SW Lal Kuthi - Git Repository Update
echo ======================================================
echo.

:: Check git status
git status --short

echo.
set /p commit_msg="Enter commit message (Leave empty for default update): "

if "!commit_msg!"=="" (
    for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
    set commit_msg=Update: !datetime:~0,4!-!datetime:~4,2!-!datetime:~6,2! !datetime:~8,2!:!datetime:~10,2!
)

echo.
echo [+] Staging all changes...
git add .

echo [+] Committing changes: "!commit_msg!"
git commit -m "!commit_msg!"

echo [+] Pushing to GitHub (origin main)...
git push origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo ======================================================
    echo [SUCCESS] Git Repository successfully updated!
    echo ======================================================
) else (
    echo.
    echo ======================================================
    echo [ERROR] Push failed! Please check your network/auth.
    echo ======================================================
)

echo.
pause
