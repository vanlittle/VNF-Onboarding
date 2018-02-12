#!/bin/bash

cd cloudify-mwc-nfv-hackaton
python backend.py &
cd wizard
npm run build
http-server -p 3000 dist/
