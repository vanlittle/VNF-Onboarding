#!/bin/bash
#########################################################################
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

###########################################################################

current_dir=${PWD}
source $current_dir/git_config.sh 

# Main code starts here
if [ "$5" = "vCloud Director" ]
then
    blueprint_folder="vCloudDirector" 
elif [ "$5" = "OpenStack" ]
then
    blueprint_folder="OpenStack" 
else
   echo error with $5 
fi
# The blueprint folder will be created with user name and time stamp 
TIME_STAMP=$(date +%T)
# The commit comment explains which blueprint you are creating 
comment=$3'_'$TIME_STAMP
FILE_NAME=$1
fname=`basename -s .zip $FILE_NAME`
INPUT=$fname
input1=$(echo $INPUT| cut -d' ' -f 1)
SUBSTRING=$(echo $input1| cut -d'-' -f 1)
mkdir $main_folder 
cd $main_folder 
git init
# make the git repository baseline by resetting it
git reset --hard HEAD
if [ ! -d $git_repository ]; then
   # Place the URL which you want to clone and place blueprint in it 
   git clone $URL 
fi
cd $git_repository 
git pull $URL

if [ "$4" = "TOSCA 1.1" ]
then
   mkdir $blueprint_folder 
   mkdir $blueprint_folder/TOSCA
   cd $blueprint_folder/TOSCA 
elif [ "$4" = "OSM 3.0" ]
then
   mkdir $blueprint_folder 
   mkdir $blueprint_folder/OSM
   cd $blueprint_folder/OSM
elif [ "$4" = "Cloudify 3.4" ] || [ "$4" = "Cloudify 4.0" ]
then
   mkdir $blueprint_folder 
   mkdir $blueprint_folder/Cloudify
   cd $blueprint_folder/Cloudify 
else
  echo Error with $4
fi

cp "$FILE_NAME" . 
unzip "*.zip"
mv $fname $fname.$TIME_STAMP
rm *.zip
git add .
commit_comment="Adding blueprint package for "$comment 
git commit -m "$commit_comment"  
git push $PUSH_URL
