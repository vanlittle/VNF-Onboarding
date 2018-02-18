
#!/bin/bash

#PID=`ps -ef | grep syncapp 'awk {print $2}'`

#if [[ -z "$PID" ]] then
#`sudo kill -9 PID`
#fi

`ps -ef | grep backend | grep -v grep | awk '{print $2}' | xargs kill`
cd mwc-nfv-hackathon/backend
python backend.py &
cd ../wizard
npm run build
npm run serve
#http-server -p 3000 dist
