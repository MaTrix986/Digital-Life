@echo off
chcp 65001 >nul
title Sender Service
echo Starting sender service...
node sender.js
pause
