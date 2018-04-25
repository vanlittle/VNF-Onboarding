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

	 
	 
	// ##########
	
	 this.FORM_SUBMIT_CLASS = 'submit';
    this.NO_CLASS = '';
    this.DISABLED_FORM_GROUP = 'form-group disabled';
    this.FORM_GROUP = 'form-group';
	
	
	// ########
	 
	 
	 this.VCDINTERFACES = ['Select Type','E1000','VMXNET3'];
	 this.OPENSTACKINTERFACES = ['Select Type','VIRTIO','PCI-PASSTHROUGH','SR-IOV','E1000','VMXNET3'];
	 this.VCD_CLOUDIFY_INTERFACES = ['Select Type','Default'];
	 this.OPENSTACK_CLOUDIFY_INTERFACES = ['Select Type','Default','SR-IOV'];
	 this.OPENSTACK_HEAT_INTERFACES = ['Select Type', 'normal', 'direct', 'macvtap', 'direct-physical', 'baremetal'];
	 
	 
	 const config_vnf = dataService.getVnfDefinition();
	 this.VIMType = config_vnf.VIMType;
	 this.OrchType = config_vnf.OrchType;
	 $scope.DisplayTooltip = false;
	 console.log(config_vnf);
	 
	 const config = dataService.getNicDefintion();
	 this.numberOfNICs = config.numberOfNICs;
     this.NICs = config.NICs;
     this.indices = config.NICsIndices;
     this.Interfaces = config.Interfaces;
     this.NICshow = [];

	console.log(config);
	 
	 this.possibleInterfaces = [];
	 
	 if (this.VIMType == 'vCloud Director'){	
	 
	    if (this.OrchType == 'Cloudify 3.4' || this.OrchType == 'Cloudify 4.0' || this.OrchType == 'Cloudify 4.3') {
			
			this.possibleInterfaces = this.VCD_CLOUDIFY_INTERFACES; 
		} else {
			
			this.possibleInterfaces = this.VCDINTERFACES; 
		}
		
	 } else{
		 
		if (this.OrchType == 'Cloudify 3.4' || this.OrchType == 'Cloudify 4.0' || this.OrchType == 'Cloudify 4.3') {
			
			this.possibleInterfaces = this.OPENSTACK_CLOUDIFY_INTERFACES; 
		} else if (this.OrchType == 'NONE'){
			this.possibleInterfaces = this.OPENSTACK_HEAT_INTERFACES;
                }else{
			this.possibleInterfaces = this.OPENSTACKINTERFACES; 
		}
	 	 
		 $scope.DisplayTooltip = true;
	 }
	 
	  console.log("possibleInterfaces");
	 console.log(this.possibleInterfaces);
	 
	 this.possibleNumbersOfNICs = [1,2,3,4,5,6];
	  
	 for (i = 0; i < this.Interfaces.length; i++) {
		 if( this.Interfaces[i] == "" || this.Interfaces[i] == undefined ){
				
				this.Interfaces[i] = this.possibleInterfaces[0];
			}
		
	 }
	 
	  console.log("Interfaces");
	  console.log(this.Interfaces);
	 
     

    
	 this.TOOLTIP = TOOLTIPS.GENERAL_NIC;

     const lastIndex = this.possibleNumbersOfNICs[this.possibleNumbersOfNICs.length-1]-1;;
     const prelastIndex = this.possibleNumbersOfNICs[this.possibleNumbersOfNICs.length -1] -5;

     this.enumarated = new Array(lastIndex + 1);

     
     $scope._localIndices = angular.copy(this.indices);

     for (let i = 0; i < lastIndex+1; ++i) {
       this.NICshow[i] = true;
     }

     for (let index = lastIndex; index >= prelastIndex; index--) {
       this.NICshow[this.indices[index]] = this.numberOfNICs > index;
     }
	
	  if (this.OrchType == 'OSM 3.0' || this.OrchType == 'RIFT.ware 5.3'){	
		this.NIC_PLACEHOLDER = ['Enter Mgmt NIC','Enter NIC name','Enter NIC name','Enter NIC name','Enter NIC name','Enter NIC name'];
		
	 } else{
	 	 this.NIC_PLACEHOLDER = ['Enter NIC name','Enter NIC name','Enter NIC name','Enter NIC name','Enter NIC name','Enter NIC name'];
	 }
     
	 this.INTERFACE_PLACEHOLDER = "Select Type";
	 this.INTERFACE_TOOLTIP= TOOLTIPS.NIC_INTERFACE_TOOLTIP;

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

     /*dataService.setSubmitCallback(() => {
		
		for (i = 0; i < this.Interfaces.length; i++) {
		
			if( this.Interfaces[i] == 'Select Type'){
				
				this.Interfaces[i] = "";
			}
		}
       const config = {
         numberOfNICs: this.numberOfNICs,
         NICs: this.NICs,
		 Interfaces: this.Interfaces,
         NICsIndices: $scope._localIndices
       };
	   console.log(config);
       dataService.setNICs(config);
       return false;
     }.bind(this)); */
	 
	 
	this.forms = {};
    this.formSubmit = false;
	// ########
	 dataService.setSubmitCallback( function () {
      this.formSubmit = true;

      var isValid = this.forms.nicDefinitionForm.$valid;
	  var validCnt = 0;
	  
	  for (i = 0; i < this.numberOfNICs; i++) {
		    
			if(this.forms.nicDefinitionForm[i].$valid){
				validCnt++;
			}
			//alert(isValid);
		}
	  
	   if( isValid || (this.numberOfNICs == validCnt++)){
				isValid = true ;
			}
	  //alert(isValid)
	
      if( isValid ) {
		  
		 
		for (i = 0; i < this.Interfaces.length; i++) {
		
			if( this.Interfaces[i] == 'Select Type'){
				
				this.Interfaces[i] = "";
			}
		}
				
		const config = {
         numberOfNICs: this.numberOfNICs,
         NICs: this.NICs,
		 Interfaces: this.Interfaces,
         NICsIndices: $scope._localIndices
       };

        dataService.setNICs( config);
      }
	   console.log(config);
	    console.log(isValid);
      return isValid;
    }.bind(this));
   }
};
