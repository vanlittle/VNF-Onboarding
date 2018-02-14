/*#############################################################################
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
 
############################################################################ */

module.exports = {
  template: require('../templates/summary.html'),
  controller: function (dataService) {
    "ngInject";

    dataService.setSubmitCallback(function () {
      return true;
    });

    this.inputs = dataService.generateInputs();

    this.inputsNames = {
      'env_type': 'VIM Type',
      'vnf_type': 'VNF Type',
      'orch_type': 'Orchestrator Type',
      'vnf_name': 'VNF Name',
      'vnfd_name': 'VNF Name',
      'image_id': 'Image',
      'vnf_description': 'VNF Description',
      'flavor': 'Flavor',
      'flavorname': 'Flavor Name',
      'cpu': 'vCPU',
      'ram': 'RAM (MB)',
      'disk': 'Disk',
      'numa_affinity' : 'Numa Affinity',
      'memory_reservation':'Memory Reservation',
      'latency_sensitivity':'Latency Sensitivity',
      'number_numa_node' : 'Number of Numa Nodes',
      'config': 'Configure Script url',
      'create': 'Create Script url',
      'delete': 'Delete Script url',
      'nic1_name': 'NIC 1',
      'nic2_name': 'NIC 2',
      'nic3_name': 'NIC 3',
      'nic4_name': 'NIC 4',
      'nic5_name': 'NIC 5',
      'nic6_name': 'NIC 6',
      'Interfaces1_name' : 'Enabled Interface 1',
      'Interfaces2_name' : 'Enabled Interface 2',
      'Interfaces3_name' : 'Enabled Interface 3',
      'Interfaces4_name' : 'Enabled Interface 4',
      'Interfaces5_name' : 'Enabled Interface 5',
      'Interfaces6_name' : 'Enabled Interface 6'
    };
      }
};
