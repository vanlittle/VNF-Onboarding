/*##########################################################################
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
 
###########################################################################*/

const TOOLTIPS = require('../config/tooltips.json');

require('imports-loader?$=>jQuery!jquery-ui-sortable-npm');

 module.exports = {
   template: require('../templates/nic_definitions.html'),
   controller: function ( dataService, $scope ) {
     "ngInject";

	 
	 this.VCDINTERFACES = ['E1000','VMXNET3'];
	 this.OPENSTACKINTERFACES = ['VIRTIO','PCI-PASSTHROUGH','SR-IOV','E1000','VMXNET3'];
	 
	 const config_vnf = dataService.getVnfDefinition();
	 this.VIMType = config_vnf.VIMType;
	 this.OrchType = config_vnf.OrchType;
	 $scope.DisplayTooltip = false;
	 
	 if (this.VIMType == 'vCloud Director'){	
		this.possibleInterfaces = this.VCDINTERFACES;
		
	 } else{
	 	 this.possibleInterfaces = this.OPENSTACKINTERFACES;
		 $scope.DisplayTooltip = true;
	 }
	 
	 console.log(this.possibleInterfaces);
	 
     const config = dataService.getNicDefintion();

     this.possibleNumbersOfNICs = [1,2,3,4,5,6];
	 this.TOOLTIP = TOOLTIPS.GENERAL_NIC;

     const lastIndex = this.possibleNumbersOfNICs[this.possibleNumbersOfNICs.length-1]-1;;
     const prelastIndex = this.possibleNumbersOfNICs[this.possibleNumbersOfNICs.length -1] -5;

     this.enumarated = new Array(lastIndex + 1);

     this.numberOfNICs = config.numberOfNICs;
     this.NICs = config.NICs;
     this.indices = config.NICsIndices;
     this.Interfaces = config.Interfaces;
     this.NICshow = [];

     $scope._localIndices = angular.copy(this.indices);

     for (let i = 0; i < lastIndex+1; ++i) {
       this.NICshow[i] = true;
     }

     for (let index = lastIndex; index >= prelastIndex; index--) {
       this.NICshow[this.indices[index]] = this.numberOfNICs > index;
     }

     this.NIC_PLACEHOLDER = ['Enter Mgmt NIC','Enter NIC name','Enter NIC name','Enter NIC name','Enter NIC name','Enter NIC name'];
	 this.INTERFACE_PLACEHOLDER = "Select Interface";
	 this.INTERFACE_TOOLTIP='VMXNET3 is only available in VMware vCD or VIO environments, and VIRTIO is only for KVM environments';

     angular.element(document).ready(() => {
       jQuery('.sortable').sortable().bind('sortupdate', () => {
         const temp = angular.copy(this.indices);
         jQuery('.sortable input').each(function (index, input) {
             temp[index] = +jQuery(input).attr('data-index');
         });

         $scope.$apply(function(){
           this.indices = temp;
           $scope._localIndices = angular.copy(this.indices);
         });
       });
     });

     $scope.$watch(() => {
       for(let index = lastIndex; index >= prelastIndex; index--) {
         this.NICshow[$scope._localIndices[index]] = this.numberOfNICs > index;
       }
     });

     dataService.setSubmitCallback(() => {
       const config = {
         numberOfNICs: this.numberOfNICs,
         NICs: this.NICs,
		 Interfaces: this.Interfaces,
         NICsIndices: $scope._localIndices
       };
	   console.log(config);
       dataService.setNICs(config);
       return true;
     });
   }
};
