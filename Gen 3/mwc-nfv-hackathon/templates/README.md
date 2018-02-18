############################################################################
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
 
#############################################################################




VNF onboarding with Cloudify
============================

Zip structure:
/types - needed types for Standard TOSCA blueprints
/scripts - scripts used in configuration
{{ env_type }}-inputs.yaml - inputs needed for Cloudify blueprint deployment, should be copied and filled outside the zip file 
{{ vnf_name }}-{{ env_type }}.yaml - Cloudify blueprint
{{ vnf_name }}-{{ env_type }}-TOSCA.yaml - Standard TOSCA blueprint
{{ vnf_name }}-{{ env_type }}-OSM.yaml - Standard TOSCA blueprint


Run your VNF with Cloudify and follow steps below.

1. Setup Cloudify virtualenv.
   
    You can skip this step if your virtualenv is already created and just activate it or use Cloudify UI instead.
    
    Using virtualenv:
    `virtualenv cloudify`
    `source cloudify/bin/activate`
    
    or using virtualenv wrapper:
    `mkvirtualenv cloudify`
    
    install cloudify cli:
    `pip install cloudify==3.4.1`
    
    Use cloudify manager:
    `cfy use -t <cfy manager ip>`

2. Install
    Fill inputs template with relevant data: {{ env_type }}-inputs.yaml
    
    At once:
    `cfy install -l {{ vnf_name }}-{{ env_type }}.zip  -n {{ vnf_name }}-{{ env_type }}.yaml -b {{ vnf_name }} --include-logs -i {{ env_type }}-inputs.yaml`
    
    or step by step:
    `cfy blueprints publish-archive -l {{ vnf_name }}-{{ env_type }}.zip  -n {{ vnf_name }}-{{ env_type }}.yaml -b {{ vnf_name }}-{{ env_type }}`
    `cfy deployments create -d {{ vnf_name }}-{{ env_type }} -b {{ vnf_name }}-{{ env_type }}`
    `cfy executions -w install -d {{ vnf_name }}-{{ env_type }} --include-logs`

3. How to operate:

    Using UI or CLI. <information>
   
4. Uninstall 

    At once:
    `cfy uninstall -d {{ vnf_name }}-{{ env_type }} --include-logs`
    
    or step by step:
    `cfy executions -w uninstall -d {{ vnf_name }}-{{ env_type }}`
    `cfy deployments delete -d {{ vnf_name }}-{{ env_type }}`
    `cfy blueprints delete -b {{ vnf_name }}-{{ env_type }}`


Standard TOSCA blueprint
------------------------

1. Setup environment
   `virtualenv env`
   `. env/bin/activate`
   `pip install git+http://git-wip-us.apache.org/repos/asf/incubator-ariatosca.git`

2. Unzip blueprints package
   `unzip {{ vnf_name }}-{{ env_type }}`

3. Parse blueprint to generate model
   `aria parse {{ vnf_name }}-{{ env_type }}/{{ vnf_name }}-{{ env_type }}-TOSCA.yaml instance`
# VNF-Onboarding
