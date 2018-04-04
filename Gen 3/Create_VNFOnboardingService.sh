#!/bin/bash
#########################################################################
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

###########################################################################

sudo cp run_wizard.sh /usr/local/bin
sudo chmod +x run_wizard.sh
WORK_DIR="WorkingDirectory=$PWD"
echo $WORK_DIR
if grep "$WORK_DIR" -q VnfOnboardingTool.service; then 
    echo "Working directory path already set in the service!" 
else
    sed -i "s#WorkingDirectory=#${WORK_DIR}#g" VnfOnboardingTool.service
fi
echo VMware1! | sudo -S cp VnfOnboardingTool.service /etc/systemd/system
echo VMware1! | sudo -S chmod +x /etc/systemd/system/VnfOnboardingTool.service
echo VMware1! | sudo -S systemctl daemon-reload
