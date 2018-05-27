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

`ps -ef | grep backend | grep -v grep | awk '{print $2}' | xargs kill`
cd mwc-nfv-hackathon/backend
if [ "$?" = "0" ]; then
    python backend.py&
    if [ "$?" -ne "0" ]; then
	echo "Failed to run python script backend.py!" 1>&2
	exit "$?" 
    fi
else
    echo "Cannot change directory!" 1>&2
    exit 1
fi
cd ../wizard
if [ "$?" = "0" ]; then
    echo VMware1! | sudo -S npm run build
    if [ "$?" -ne "0" ]; then
	echo "Failed to run npm build command:" 1>&2
	exit "$?" 
    fi
    echo VMware1! | sudo -S npm run serve
    if [ "$?" -ne "0" ]; then
	echo "Failed to run npm serve command:" 1>&2
	exit "$?" 
    fi
else
	echo "Cannot change directory!" 1>&2
	exit 1
fi
