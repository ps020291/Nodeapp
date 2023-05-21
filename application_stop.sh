#!/bin/bash

# Stop the Node.js application using PM2
pm2 stop nodeapp

# Verify if the application has stopped successfully
pm2 describe nodeapp &> /dev/null
status=$?

# Check the exit status
if [ $status -eq 0 ]; then
    echo "Application could not be stopped."
    exit 1
else
    echo "Application stopped successfully."
    exit 0
fi
