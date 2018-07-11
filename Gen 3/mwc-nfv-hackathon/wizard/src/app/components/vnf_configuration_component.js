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
  template: require('../templates/vnf_configuration.html'),
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
	 

	//vnf VMs
	
	const vm_config = dataService.getVnfDefinition();
	this.numberOfVMs = vm_config.numberOfVMs;
	this.VMsIndices = vm_config.VMsIndices;
	this.VIMType = vm_config.VIMType
	this.OrchType = vm_config.OrchType
	console.log(this.VMsIndices);
	console.log(this.numberOfVMs);
	console.log(vm_config);
	
	this.VIMTypeSelected = this.VIMType;
	this.OrchTypeSelected = this.OrchType ;
	
	$scope.doCollapse = function(index){
   
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
	
	
	// VNF configuration
    var config = dataService.getVnfConfiguration();
	
	 //Image array
	this.Image = config.Image;
	this.indices = config.ImageIndices;
	
	//Disk
	this.Disk = config.Disk
	for (let d = 0; d <this.Disk.length; d++){
			     
		this.Disk[d] = this.Disk[d] || '10';
    }
	
       
	// CPU 
    this.vCPUs = dataService.getVCPUs();
	this.vCPU = config.vCPU;
	this.vCPUSelected = this.vCPU;
	for (let c = 0; c <this.vCPU.length; c++){
			     
		this.vCPUSelected[c] = this.vCPU[c] || '0';	  
    }
    
    
	//RAM
    this.RAMs = dataService.getRAMs();
	this.RAM = config.RAM;
	this.RAMSelected = this.RAM;
	for (let r = 0; r <this.RAM.length; r++){
			     
		this.RAMSelected[r] = this.RAM[r] || '1';	  
    }
   
    
	// Flavor
        this.Flavors = dataService.getFlavors();
	this.Flavor = config.Flavor
	this.FlavorSelected = this.Flavor;
	for (let fl = 0; fl <this.Flavor.length; fl++){
			     
		this.FlavorSelected[fl] = this.Flavor[fl] || this.Flavors[Object.keys(this.Flavors)[0]];	  
    }
   
	this.flavorname = config.flavorname;
    
         

   
    
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
      return ((this.isOpenStack()) &&(this.isOSM() || this.isRIFT()))? this.FORM_GROUP : this.DISABLED_FORM_GROUP;
    };
   
    this.isOSM = function() {
      return this.OrchTypeSelected === this.OSM_NAME;
    };

    this.isRIFT = function() {
      return this.OrchTypeSelected === this.RIFT_NAME;
    };
   
    this.isOSM_VCDClass = function(index) {
        if((this.FlavorSelected[index] == "auto") &&(this.isOpenStack()) &&(this.OrchTypeSelected == 'TOSCA 1.1')){
            return this.FORM_GROUP;
        }
        else{
            return ((this.isOSM())|| (this.isRIFT()) || (this.isVCD())) ? this.DISABLED_FORM_GROUP : this.FORM_GROUP;
        }
    };
    
    this.isOSM_TOSCA_CUSTOM_FLAVOR_Class = function(index) {
        if((this.FlavorSelected[index] == "auto") &&(this.isOpenStack()) &&(this.OrchTypeSelected == 'TOSCA 1.1' || this.OrchTypeSelected == 'Cloudify 3.4' || this.OrchTypeSelected == 'Cloudify 4.0'|| this.OrchTypeSelected == 'NONE' )){
	     return this.FORM_GROUP
        }
        else{
           return this.DISABLED_FORM_GROUP;
        }
    };
    
    this.isOSM_or_VCD_Class = function(index) {
        if((this.FlavorSelected[index] == "auto") &&(this.isOpenStack()) &&(this.OrchTypeSelected == 'TOSCA 1.1' || this.OrchTypeSelected == 'Cloudify 3.4' || this.OrchTypeSelected == 'Cloudify 4.0'|| this.OrchTypeSelected == 'NONE' )){
	     return this.FORM_GROUP
        }
        else{
           return ((this.isOSM())|| (this.isRIFT()) || (this.isVCD())) ? this.FORM_GROUP : this.DISABLED_FORM_GROUP;
        }
    };
    this.isOSM_or_VCD_and_NONE_Class = function(index) {
        if((this.FlavorSelected[index] == "auto") &&(this.isOpenStack()) &&(this.OrchTypeSelected == 'TOSCA 1.1' || this.OrchTypeSelected == 'Cloudify 3.4' || this.OrchTypeSelected == 'Cloudify 4.0'|| this.OrchTypeSelected == 'NONE' )){
	     return this.FORM_GROUP
        }
        else{
           return ((this.isOSM())|| (this.isRIFT()) || (this.isVCD() && this.OrchTypeSelected != 'NONE')) ? this.FORM_GROUP : this.DISABLED_FORM_GROUP;
        }
    };
    
    this.isDISK_RAM_CPU = function(){
      if(this.isVCD() || (this.isOpenStack() && this.isOSM())){
          return true;
        }
        else{
            return false;
        }
    }


   
	
    this.isCUSTOM_FLAVOR = function(index) {
        if(this.FlavorSelected[index] == "auto"){     
            return true;
        }
        else{
            return false;
        }
    };
    this.isOSM_And_VCD = function() {
        return ((this.isOSM() || this.isRIFT()) && (this.isVCD())) ? true : false;
    };
    this.onVNFTypeChange = function(newValue) {
      this.vnfDescription = newValue;
    };

    this.uploadfilename = function(filename) {
        this.uploadfile = filename; 
        util.print("FileName = " + this.uploadfile); 
    };
	
		
    dataService.setSubmitCallback( function () {
      this.formSubmit = true;

      var isValid = this.forms.vnfDefinitionForm.$valid;
	  
	  
	  this.validCnt = 0 ;
	  for (i = 0; i < this.numberOfVMs; i++) {
		  
		  //alert(this.Image[i]);
		  if( (typeof this.Image[i] == 'undefined') || (this.Image[i] =="")){
			  
			  this.validCnt++;
			  
		  }else if ((typeof this.Disk[i] == 'undefined') || (this.Disk[i] =="") || (this.Disk[i] == 0)|| isNaN(this.Disk[i]))
                  {
                      this.validCnt++;
                  }

		  		  		  
		  
	  }
	  if(this.validCnt){
		  isValid = false;
	  }	  

      if( isValid ) {
		  
		  
		if(this.VIMTypeSelected == 'vCloud Director' || (this.VIMTypeSelected == 'OpenStack' &&  (this.OrchTypeSelected == 'OSM 3.0' || this.OrchTypeSelected == 'RIFT.ware 5.3'))) {
		        for (let cf = 0; cf <this.Flavor.length; cf++){
			    if(this.Flavor[cf] == 'auto'){			
				this.Flavor[cf] = this.Flavors[Object.keys(this.Flavors)[0]];	  
			    }
			}
			this.FlavorSelected = this.Flavor;
			this.flavorname = ['', '', '', '', '',''];
		}
		for (let fl = 0; fl <this.Flavor.length; fl++){
			if((this.FlavorSelected[fl] != 'auto' && ( this.VIMTypeSelected == 'OpenStack' &&  (this.OrchTypeSelected == 'TOSCA 1.1' || this.OrchTypeSelected == 'Cloudify 3.4' || this.OrchTypeSelected == 'Cloudify 4.0' )))){
				this.Disk[fl] = this.Disk[fl] || '10';
				this.RAMSelected[fl] = this.RAM[fl] || '1';
				this.vCPUSelected[fl] = this.vCPU[fl] || '0';	 
				this.flavorname[fl] = "";
			}
		}
		
		var config = {
                
          Image: this.Image,
          vCPU: this.vCPUSelected,
          RAM: this.RAMSelected,
          Disk: this.Disk,
          Flavor: this.FlavorSelected,
          flavorname: this.flavorname
        };
		//console.log(config);
        dataService.setVNFC( config);
		console.log("getVnfConfiguration");
		console.log(dataService.getVnfConfiguration());
      }

      return isValid;
    }.bind(this));
  }
};
