###############################################################################
##
# Copyright 2017-2018 VMware Inc.
# This file is part of VNF-ONboarding
# All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License"); you may
# not use this file except in compliance with the License. You may obtain
# a copy of the License at
#
#         http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
# License for the specific language governing permissions and limitations
# under the License.
#
# For those usages not covered by the Apache License, Version 2.0 please
# contact:  osslegalrouting@vmware.com
 
##
 
##############################################################################


VNF onboarding Wizard
=====================

**Latest docker image**
  https://s3-eu-west-1.amazonaws.com/gigaspaces-delivery/vnf-wizard/mwc-latest.tar

Docker
------
**Install docker**

`wget https://get.docker.com/ -O get_docker.sh`

`sudo bash get_docker.sh`

**Get docker image**

`wget https://s3-eu-west-1.amazonaws.com/gigaspaces-delivery/vnf-wizard/mwc-latest.tar -O mwc-wizard.tar`

**Import image & run docker container**

`sudo docker import mwc-wizard.tar mwc-wizard`

`sudo docker run -p 0.0.0.0:80:3000 -p 0.0.0.0:5000:5000 -td mwc-wizard /bin/bash run_wizard.sh`



Scripts server (if needed)
--------------------------
`cd blueprints/scripts`

`python -m SimpleHTTPServer 5555`

Backend
-------

**Install requirements**
  
  pip install -r req.txt

**Run service**
 
  `python backend.py`

**Test backend call**
  
  `curl -X POST http://localhost:5000 --header "Content-Type: application/json" -d '{"blueprint_dir": "blueprints", "params": {"env_type": "OS", "disk_size": "", "nic2_name": "nic2", "image_id": "993b6748-f50f-40c6-86ba-071906865d52", "memory": "", "nic1_name": "nic1", "nic3_name": "nic3", "nic4_name": "nic4", "flavor_id": "8e6069a3-d8c6-4741-8e0d-6373b2ca38cc", "scripts": {"create": "http://localhost:5555/create.sh"}, "vnf_name": "Fortigate_VNF", "vnf_description": "Fortigate description", "cpu": ""}}' > out.zip`

Frontend
--------

`cd wizard`

**Install requiremens**
  
  You need to have npm and nodejs installed on your computer.

**Install packages** 

  `npm install`

  In case of problems you can try:
  
  `nodejs node_modules/node-sass/scripts/install.js`

  `npm rebuild node-sass`

**Run the wizard**

  `npm run serve`

  Wizard is ready on `http://localhost:3000/`


Changes
-------
To change:

** Backend port **

  Change backend.py:27 for serving backend.
  Change wizard/src/app/services/data_service.js:106

** Flavors, tooltips, vnf_types **

  Change wizard/src/app/config/<desired_file>.json

Docker
------

** List running containers **

  `sudo docker ps`

** Create image **
  
  `sudo docker export -o mwc.tar <docker container id>`

** Restart container **

  `sudo docker restart <docker container id>`

** Commit changes **

  You need to commit running container (from the other session)
  `sudo docker commit <docker container id> <base image>`

** Connect to docker container **
  
  `sudo docker exec -ti /bin/bash`
