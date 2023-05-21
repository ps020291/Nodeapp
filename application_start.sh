#!/bin/bash
sudo chmod -R 777 /home/ubuntu/nodeapp
cd /home/ubuntu/nodeapp

#export nvm_dir = "$HOME/.nvm"
#[ -s  "$nvm_dir/nvm.sh" ] &&  \.  "$nvm_dir/nvm.sh"
#[ -s  "$nvm_dir/bash_completion"  ] &&  \.  "$nvm_dir/bash_completion"

npm install

pm2 start server.js --name nodeapp

# Verify if the application has started successfully
pm2 describe nodeapp &> /dev/null
status=$?

# Check the exit status
if [ $status -eq 0 ]; then
    echo "Application started successfully."
    exit 0
else
    echo "Application could not be started."
    exit 1
fi