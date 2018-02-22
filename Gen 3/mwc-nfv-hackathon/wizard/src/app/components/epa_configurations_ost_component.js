/*#########################################################################
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
 
##########################################################################*/

const TOOLTIPS = require('../config/tooltips.json');

module.exports = {
  template: require('../templates/epa_configuration_os_tosca.html'),
  controller: function ( dataService, $scope) {
    "ngInject";
	
	this.FORM_SUBMIT_CLASS = 'submit';
    this.NO_CLASS = '';
	this.DISABLED_FORM_GROUP = 'form-group disabled';
    this.FORM_GROUP = 'form-group';
	this.INPUT_PLACEHOLDER = "number";
	this.NUMBER_NUMA_NODE ;
	this.NUMA_AFFINITY = false;
	this.MEMORY_RESERVATION = false;
	this.LATENCY_SENSITIVITY = false;
	
	this.MEMORY_RESERVATION_TOOLTIP = TOOLTIPS.MEMORY_RESERVATION_TOOLTIP;
	this.LATENCY_SENSITIVITY_TOOLTIP = TOOLTIPS.LATENCY_SENSITIVITY_TOOLTIP;
	this.NUMA_AFFINITY_TOOLTIP = TOOLTIPS.NUMA_AFFINITY_TOOLTIP;
	this.NUMBER_NUMA_NODES_TOOLTIP = TOOLTIPS.NUMBER_NUMA_NODES_TOOLTIP;
	
	const config_epa = dataService.getEpaDefintion();
	console.log(config_epa);
	
		
	$scope.NumaAffinitySelected = config_epa.NumaAffinity;
	$scope.MemoryReservationSelected = config_epa.MemoryReservation;
	$scope.LatencySensitivitySelected = config_epa.LatencySensitivity;
	$scope.NumberNumaNodeSelected = config_epa.NumberNumaNode;
	
	//$scope.NumaAffinitySelected = false;
	//$scope.MemoryReservationSelected = false;
	//$scope.LatencySensitivitySelected = false;
	//$scope.NumberNumaNodeSelected = 1;
	$scope.SRIOVInterfacesSelected = [];
	
	const config_vnf = dataService.getVnfDefinition();
	this.VIMType = config_vnf.VIMType;
	this.OrchType = config_vnf.OrchType;
	
	
	const config_nic = dataService.getNicDefintion();
	$scope.NICs = remove_dups(config_nic.NICs);
	
		
   function  remove_dups(object){	   
		var NICs = [];
		for (i = 0; i < object.length ; i++) {
				if (typeof object[i] !== 'undefined' && object[i] !== null && object[i] != ""){	
				NICs.push(object[i]);
			}
		}
		return NICs;
	}
	
	dataService.setSubmitCallback( function () {
		
		this.formSubmit = true;
		var isValid = this.forms.epaDefinitionForm.$valid;
		
		if( isValid ) {
			if(!$scope.NumaAffinitySelected)
			{
				$scope.NumberNumaNodeSelected = 0;
			}
			var config = {
			  NumaAffinity: $scope.NumaAffinitySelected,
			  MemoryReservation: $scope.MemoryReservationSelected,
			  LatencySensitivity: $scope.LatencySensitivitySelected,
			  NumberNumaNode:$scope.NumberNumaNodeSelected,
			  SRIOVInterfaces:$scope.SRIOVInterfacesSelected
					  
			};
			dataService.setEPA( config);
			
		}
		return isValid;
		
	}.bind(this));
  }
};
