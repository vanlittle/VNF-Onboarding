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
  controller: function ( dataService,authService) {
    "ngInject";

    this.FORM_SUBMIT_CLASS = 'submit';
    this.NO_CLASS = '';
    this.VCD_NAME = 'vCloud Director';
    this.OPENSTACK_NAME = 'OpenStack';
    this.CUSTOM_FLAVOR = "auto"; 
    this.TOSCA_NAME = "TOSCA 1.1"; 
    this.OSM_NAME = 'OSM 3.0';
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

    var config = dataService.getVnfDefinition();

    this.VIMType = ['vCloud Director', 'OpenStack'];
    this.VIMTypeSelected = config.VIMType;

    this.OrchType = ['TOSCA 1.1', 'Cloudify 3.4', 'OSM 3.0'];
    this.OrchTypeSelected = config.OrchType;

    this.vnfDescription = config.VNFDescription || this.VNFTypeSelected;
  
    this.VNFDname = config.VNFDname; 
    
    this.VNFType = dataService.getVNFTypes();
    this.VNFTypeSelected = config.VNFType;

    this.vCPUs = dataService.getVCPUs();
    this.vCPUSelected = config.vCPU;

    this.RAMs = dataService.getRAMs();
    this.RAMSelected = config.RAM;

    this.Flavors = dataService.getFlavors();
    this.FlavorSelected = config.Flavor || this.Flavors[Object.keys(this.Flavors)[0]];

    this.flavorname = config.flavorname;
    
    this.Disk = config.Disk;

    this.Image = config.Image;

    this.forms = {};
    this.formSubmit = false;

    this.isVCD = function() {
      return this.VIMTypeSelected === this.VCD_NAME;
    };

    this.isVCDClass = function() {
      return this.isVCD() ? this.FORM_GROUP : this.DISABLED_FORM_GROUP;
    };

    this.isOpenStack = function() {
      return this.VIMTypeSelected === this.OPENSTACK_NAME;
    };

    this.isOpenStackClass = function() {
      return this.isOpenStack() ? this.FORM_GROUP : this.DISABLED_FORM_GROUP;
    };

    this.isOpenStackOSMClass = function() {
      return ((this.isOpenStack()) &&(this.OSM()))? this.FORM_GROUP : this.DISABLED_FORM_GROUP;
    };
   
    this.isOSM = function() {
      return this.OrchTypeSelected === this.OSM_NAME;
    };
   
    this.isOSM_VCDClass = function() {
       //alert(this.FlavorSelected); 
       //alert(this.isOpenStack()); 
       //alert(this.OrchTypeSelected); 
        if((this.FlavorSelected == "Custom Flavor") &&(this.isOpenStack()) &&(this.OrchTypeSelected == 'TOSCA 1.1')){
     //  alert(this.isOpenStack()); 
            return this.FORM_GROUP;
        }
        else{
            return ((this.isOSM())|| (this.isVCD())) ? this.DISABLED_FORM_GROUP : this.FORM_GROUP;
        }
    };
    
    this.isOSM_TOSCA_CUSTOM_FLAVOR_Class = function() {
        if((this.FlavorSelected == "auto") &&(this.isOpenStack()) &&(this.OrchTypeSelected == 'TOSCA 1.1')){
	     return this.FORM_GROUP
        }
        else{
           return this.DISABLED_FORM_GROUP;
        }
    };
    
    this.isOSM_or_VCD_Class = function() {
        if((this.FlavorSelected == "auto") &&(this.isOpenStack()) &&(this.OrchTypeSelected == 'TOSCA 1.1')){
	     return this.FORM_GROUP
        }
        else{
           return ((this.isOSM())|| (this.isVCD())) ? this.FORM_GROUP : this.DISABLED_FORM_GROUP;
        }
    };
    this.isCUSTOM_FLAVOR = function() {
        if(this.FlavorSelected == "auto"){     
            return true;
        }
        else{
            return false;
        }
    };
    this.isOSM_And_VCD = function() {
      return ((this.isOSM())&& (this.isVCD())) ? true : false;
    };
    this.onVNFTypeChange = function(newValue) {
      this.vnfDescription = newValue;
    };

    dataService.setSubmitCallback( function () {
      this.formSubmit = true;

      var isValid = this.forms.vnfDefinitionForm.$valid;

      if( isValid ) {
        var config = {
          VIMType: this.VIMTypeSelected,
          OrchType: this.OrchTypeSelected,
          VNFType: this.VNFTypeSelected,
          VNFDescription: this.vnfDescription,
          VNFDname: this.VNFDname,        
          Image: this.Image,
          vCPU: this.vCPUSelected,
          RAM: this.RAMSelected,
          Disk: this.Disk,
          Flavor: this.FlavorSelected,
          flavorname: this.flavorname
        };

        dataService.setVNF( config);
      }

      return isValid;
    }.bind(this));
  }
};
