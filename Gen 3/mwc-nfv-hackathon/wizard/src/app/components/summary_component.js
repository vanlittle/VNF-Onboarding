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
  controller: function (dataService, $scope ) {
    "ngInject";

    dataService.setSubmitCallback(function () {
      return true;
    });
	
	 const config_vnf = dataService.getVnfDefinition();
	 this.numberOfVMs = config_vnf.numberOfVMs;
	 this.VMsIndices = config_vnf.VMsIndices;
	 
	 $scope.doSomething1 = function(index){
   
	    var id ="expand-" + index;
		var spanId = "arrow-"+index;
		var x = document.getElementById(id);
		if (x.style.display === "block") {
				x.style.display = "none";
				document.getElementById(spanId).innerHTML = '<clr-icon shape="caret" style="transform: rotate(270deg);"></clr-icon>';
		} else {
				x.style.display = "block";
				document.getElementById(spanId).innerHTML = '<clr-icon shape="caret" style="transform: rotate(180deg);"></clr-icon>';
		}
	    
		var vrows = document.getElementsByName("expand");
	
		for (i = 0; i <= vrows.length; i++) {
			if (Number(i) != Number(index)) {
				
				vrows[i].style.display = "none";
				innerId = "arrow-"+i;
				document.getElementById(innerId).innerHTML = '<clr-icon shape="caret" style="transform: rotate(270deg);"></clr-icon>';
							
			}
			
		}
	};
	
    this.inputs = dataService.generateInputs();
	console.log(this.inputs);
	
	console.log("i am here");
	console.log(this.inputs.params[0].scripts);

    this.inputsNames = {
      'env_type': 'VIM Type',
      'vnf_type': 'VNF Type',
      'orch_type': 'Orchestrator Type',
      'vnf_name': 'VNF Name',
      'vnfd_name': 'VNF Name',
      'image_id': 'Image',
      'vnf_description': 'VNF Description',
      'flavor': 'Flavor ID',
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
	  'mgmt_network':'Management Network',
	  'mgmt_network_ethernet_type' : 'Mgmt Network Ethernet Type',
      'Network1_name': 'Network 1',
      'Network2_name': 'Network 2',
      'Network3_name': 'Network 3',
      'Network4_name': 'Network 4',
      'Network5_name': 'Network 5',
      'Network6_name': 'Network 6',
	  'Network7_name': 'Network 7',
      'Network8_name': 'Network 8',
      'Network9_name': 'Network 9',
      'Network10_name': 'Network 10',
      'Network11_name': 'Network 11',
      'Network12_name': 'Network 12',
	  'Network13_name': 'Network 13',
      'Network14_name': 'Network 14',
      'Network15_name': 'Network 15',
      'Network16_name': 'Network 16',
      'Network17_name': 'Network 17',
      'Network18_name': 'Network 18',
	  'Network19_name': 'Network 19',
      'Network20_name': 'Network 20',
      'NetworkInterface1_name' : 'Enabled Network Interface 1',
      'NetworkInterface2_name' : 'Enabled Network Interface 2',
      'NetworkInterface3_name' : 'Enabled Network Interface 3',
      'NetworkInterface4_name' : 'Enabled Network Interface 4',
      'NetworkInterface5_name' : 'Enabled Network Interface 5',
      'NetworkInterface6_name' : 'Enabled Network Interface 6',
	  'NetworkInterface1_name' : 'Enabled Network Interface 1',
      'NetworkInterface2_name' : 'Enabled Network Interface 2',
      'NetworkInterface3_name' : 'Enabled Network Interface 3',
      'NetworkInterface4_name' : 'Enabled Network Interface 4',
      'NetworkInterface5_name' : 'Enabled Network Interface 5',
      'NetworkInterface6_name' : 'Enabled Network Interface 6',
	  'NetworkInterface1_name' : 'Enabled Network Interface 1',
      'NetworkInterface2_name' : 'Enabled Network Interface 2',
      'NetworkInterface3_name' : 'Enabled Network Interface 3',
      'NetworkInterface4_name' : 'Enabled Network Interface 4',
      'NetworkInterface5_name' : 'Enabled Network Interface 5',
      'NetworkInterface6_name' : 'Enabled Network Interface 6',
	  'NetworkInterface5_name' : 'Enabled Network Interface 5',
      'NetworkInterface6_name' : 'Enabled Network Interface 6',
	  'Create Network1': 'Create Network 1',
      'Create Network2': 'Create Network 2',
      'Create Network3': 'Create Network 3',
      'Create Network4': 'Create Network 4',
      'Create Network5': 'Create Network 5',
      'Create Network6': 'Create Network 6',
	  'Create Network7': 'Create Network 7',
      'Create Network8': 'Create Network 8',
      'Create Network9': 'Create Network 9',
      'Create Network10': 'Create Network 10',
      'Create Network11': 'Create Network 11',
      'Create Network12': 'Create Network 12',
	  'Create Network13': 'Create Network 13',
      'Create Network14': 'Create Network 14',
      'Create Network15': 'Create Network 15',
      'Create Network16': 'Create Network 16',
      'Create Network17': 'Create Network 17',
      'Create Network18': 'Create Network 18',
	  'Create Network19': 'Create Network 19',
      'Create Network20': 'Create Network 20',
	  'Network1_type' : 'Network Type 1',
	  'Network2_type' : 'Network Type 2',
	  'Network3_type' : 'Network Type 3',
	  'Network4_type' : 'Network Type 4',
	  'Network5_type' : 'Network Type 5',
	  'Network6_type' : 'Network Type 6',
	  'Network7_type' : 'Network Type 7',
	  'Network8_type' : 'Network Type 8',
	  'Network9_type' : 'Network Type 9',
	  'Network10_type' : 'Network Type 10',
	  'Network11_type' : 'Network Type 11',
	  'Network12_type' : 'Network Type 12',
	  'Network13_type' : 'Network Type 13',
	  'Network14_type' : 'Network Type 14',
	  'Network15_type' : 'Network Type 15',
	  'Network16_type' : 'Network Type 16',
	  'Network17_type' : 'Network Type 17',
	  'Network18_type' : 'Network Type 18',
	  'Network19_type' : 'Network Type 19',
	  'Network20_type' : 'Network Type 20',
	  'Ethernet1_type' : 'Ethernet Type 1',
	  'Ethernet2_type' : 'Ethernet Type 2',
	  'Ethernet3_type' : 'Ethernet Type 3',
	  'Ethernet4_type' : 'Ethernet Type 4',
	  'Ethernet5_type' : 'Ethernet Type 5',
	  'Ethernet6_type' : 'Ethernet Type 6',
	  'Ethernet7_type' : 'Ethernet Type 7',
	  'Ethernet8_type' : 'Ethernet Type 8',
	  'Ethernet9_type' : 'Ethernet Type 9',
	  'Ethernet10_type' : 'Ethernet Type 10',
	  'Ethernet11_type' : 'Ethernet Type 11',
	  'Ethernet12_type' : 'Ethernet Type 12',
	  'Ethernet13_type' : 'Ethernet Type 13',
	  'Ethernet14_type' : 'Ethernet Type 14',
	  'Ethernet15_type' : 'Ethernet Type 15',
	  'Ethernet16_type' : 'Ethernet Type 16',
	  'Ethernet17_type' : 'Ethernet Type 17',
	  'Ethernet18_type' : 'Ethernet Type 18',
	  'Ethernet19_type' : 'Ethernet Type 19',
	  'Ethernet20_type' : 'Ethernet Type 20',
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
