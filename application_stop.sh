#!/bin/bash
cd /home/ubuntu/nodeapp
# Stop the Node.js application using PM2
pm2 stop nodeapp 2>&1

# Verify if the application has stopped successfully
pm2 describe nodeapp &> /dev/null
status=$?
echo $status
# Check the exit status
if [ $status -eq 0 ]; then
    echo "Application stopped successfully."
    exit 0
elif [ $status -eq 1 ]; then
    echo "Process or Namespace not found. Application may not be running."
    exit 0
else
    echo "Failed to stop the application. Error code: $status"
    exit 1
fi
