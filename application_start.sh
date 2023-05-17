#!/bin/bash
sudo chmod -R 777 /home/ubuntu/nodeapp
cd /home/ubuntu/nodeapp

export nvm_dir = "$HOME/.nvm"
[ -s  "$nvm_dir/nvm.sh" ] &&  \.  "$nvm_dir/nvm.sh"
[ -s  "$nvm_dir/bash_completion"  ] &&  \.  "$nvm_dir/bash_completion"

npm install
#pm2 start npm --name="nodeapp"
pm2 start server.js

node app.js>app.out.log. 2> app.error.log < /dev/null &
