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
 
#############################################################################*/
const TOOLTIPS = require('../config/tooltips.json');

module.exports = {
  template: require('../templates/vnf_definition.html'),
  controller: function ( dataService,authService, $scope) {
    "ngInject";

    this.FORM_SUBMIT_CLASS = 'submit';
    this.NO_CLASS = '';
    this.VCD_NAME = 'vCloud Director';
    this.OPENSTACK_NAME = 'OpenStack';
    this.CUSTOM_FLAVOR = "auto"; 
    this.TOSCA_NAME = "TOSCA 1.1"; 
    this.OSM_NAME = 'OSM 3.0';
    this.RIFT_NAME = 'RIFT.ware 5.3';
    this.OPERATION_TYPE = 'Upload Blueprint' 
    this.DISABLED_FORM_GROUP = 'form-group disabled';
    this.FORM_GROUP = 'form-group';
    this.INPUT_PLACEHOLDER = "Type here";
    this.VIM_TOOLTIP = TOOLTIPS.VIM_TOOLTIP
    this.ORCH_TOOLTIP = TOOLTIPS.ORCH_TOOLTIP
    this.VNF_TOOLTIP = TOOLTIPS.VNF_TOOLTIP;
    this.VNF_DESCRIPTION_TOOLTIP = TOOLTIPS.VNF_DESCRIPTION_TOOLTIP;
    this.VNFD_NAME_TOOLTIP = TOOLTIPS.VNFD_NAME_TOOLTIP;
    this.IMAGE_TOOLTIP = TOOLTIPS.IMAGE;
    this.DISK_TOOLTIP = TOOLTIPS.DISK;
    this.FLAVOR_TOOLTIP = TOOLTIPS.FLAVOR_TOOLTIP;
    this.FLAVOR_NAME_TOOLTIP = TOOLTIPS.FLAVOR_NAME_TOOLTIP;
    this.VM_TOOLTIP =  TOOLTIPS.VM_TOOLTIP    
	
    var config = dataService.getVnfDefinition();

    this.VIMType = ['vCloud Director', 'OpenStack'];
    this.VIMTypeSelected = config.VIMType;
	
	
	
	this.OrchType = ['OSM 3.0','Cloudify 3.4','Cloudify 4.0','TOSCA 1.1', 'RIFT.ware 5.3'];
    this.OrchTypeSelected = config.OrchType;
	this.OrchTypeSelected = config.OrchType;

	
	this.VNFDname = config.VNFDname; 
    
	 this.vnfDescription = config.VNFDescription || this.VNFTypeSelected;
    this.VNFType = dataService.getVNFTypes();
    this.VNFTypeSelected = config.VNFType;
	
	this.numberOfVMs = config.numberOfVMs;
	this.VMsIndices = config.VMsIndices;
	
	this.possibleNumbersOfVMs = config.possibleNumbersOfVMs;
	console.log(config.possibleNumbersOfVMs);
	
	
	
	$scope.OperationTypeSelected = config.VMsIndices;
	
	
	console.log(" AT top ---- VIM : " + this.VIMTypeSelected + " Orch : " + this.OrchTypeSelected);
   
	//$scope.vnfDescription = this.VNFDescription;
  
    

    this.NumaAffinity = [true,false] ;
	this.NumaAffinity2 = false ;
	
	// Number of VM 
	
		
    this.forms = {};
    this.formSubmit = false;
    this.maxvalue = 20;
    this.minvalue = 1;
    $scope.$watch(() => {
       $scope.maxNicsError = false;
       //alert(this.numberOfVMs);
       if(isNaN(this.numberOfVMs) || this.numberOfVMs > this.maxvalue || this.numberOfVMs < this.minvalue){
                $scope.maxNicsError = true;
        }

     });
    
	
    dataService.setSubmitCallback( function () {
      this.formSubmit = true;
	
      var isValid = this.forms.vnfDefinitionForm.$valid;
      if(isNaN(this.numberOfVMs) || this.numberOfVMs > this.maxvalue || this.numberOfVMs < this.minvalue){
                isValid = false;
        }
	
	if(isValid){	
	var vnf_config = {
          VIMType: this.VIMTypeSelected,
          OrchType: this.OrchTypeSelected,
          VNFType: this.VNFTypeSelected,
          VNFDescription: this.vnfDescription,
          VNFDname: this.VNFDname,        
          numberOfVMs : this.numberOfVMs,
	  VMsIndices : this.VMsIndices,
	  possibleNumbersOfVMs : this.possibleNumbersOfVMs
	  }
	  //console.log(vnf_config);
	  dataService.setVNFD( vnf_config);
	  console.log("getVnfDefinition");
	  console.log(dataService.getVnfDefinition());
	}	
      return isValid;
	  //return false;
    }.bind(this));
  }
};
