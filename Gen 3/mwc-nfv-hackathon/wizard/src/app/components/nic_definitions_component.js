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
	 
	  
	 this.possibleNumbersOfNICs = [1,2,3,4,5,6,7,8,9,10];
         this.nicCnt = this.possibleNumbersOfNICs.length;
	 this.VCDINTERFACES = ['Select Type','E1000'];
	 this.OPENSTACKINTERFACES = ['Select Type','VIRTIO','PCI-PASSTHROUGH','SR-IOV','E1000'];
	 this.VCD_CLOUDIFY_INTERFACES = ['Select Type','Default'];
	 this.OPENSTACK_CLOUDIFY_INTERFACES = ['Select Type','normal','direct','macvtap'];
	 
	 
	 const config_vnf = dataService.getVnfDefinition();
	 this.VIMType = config_vnf.VIMType;
	 this.OrchType = config_vnf.OrchType;
	 this.numberOfVMs = config_vnf.numberOfVMs;
	 this.VMsIndices = config_vnf.VMsIndices;
	 
	 
	console.log("Interfaces");
	console.log(this.VMsIndices);
	console.log(this.numberOfVMs);
	//console.log(vm_config);
	 $scope.DisplayTooltip = false;
	 console.log(config_vnf);
	 
	 const netconfig = dataService.getNetworkConfiguration();
	 this.netNetworks = netconfig.Networks;
	 this.mgmtNetwork = netconfig.mgmtNetwork;
	 
	 const config = dataService.getNicDefintion();
	 this.numberOfNICs = config.numberOfNICs;
	 this.NICs = config.NICs;
	 this.indices = config.NICsIndices;
	 this.Interfaces = config.Interfaces;
	 this.NICshow = [[]];
	 //this.NICshow[0][0] = true;
	 this.Networks ={'Select Type':'Select Type'};
	 if(this.mgmtNetwork){
                this.Networks[this.mgmtNetwork] = this.mgmtNetwork;
         }
	 for (let n = 0; n <this.netNetworks.length; n++){
		 if(this.netNetworks[n].trim()){
			 
			 this.Networks[this.netNetworks[n]]=this.netNetworks[n];
		 }
	 }
	 
	 console.log('netNetworks');
	 console.log(this.Networks);
	 
	 // Networks
	/* if (this.VIMType == 'vCloud Director'){	
		this.Networks = dataService.getVcdNetworks();
	 }else{
		 this.Networks = dataService.getOsNetworks();
	 }
	 */
	 
	 
	this.NICs = config.NICs;
	this.NetworkSelected = this.NICs;
	for (var i = 0; i < this.numberOfVMs; i++) {
		for (let n = 0; n <this.NICs.length; n++){
					 
			this.NetworkSelected[i][n] = this.NICs[i][n] || this.Networks[Object.keys(this.Networks)[0]];	  
		}
	}
	//this.flavorname = config.flavorname;

	console.log(this.Networks);
	
	//const vm_config = dataService.getVnfSelectBlueprint();
	
	
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
	 
	this.NICshow = new Array(this.possibleNumbersOfNICs);
	for (var i = 0; i < this.possibleNumbersOfNICs; i++) {
		this.NICshow [i] = new Array(this.numberOfNICs.length);
	}
	
/*		for (i = 0; i < this.numberOfVMs; i++) {
		for (j = 0; j < this.numberOfNICs.length; j++) {
		    
				this.NICshow[i][j] = true;
		
	}
	
	
		x[5][12] = 3.0;
	 for (i = 0; i < this.numberOfVMs; i++) {
				
			 for (j = 0; j < this.numberOfNICs[i]; j++) {
		    
				this.NICshow[i][j] = false;
				
			
			}
		}
	*/ 
	 this.possibleInterfaces = [];
	 
	 if (this.VIMType == 'vCloud Director'){	
	 
	    if (this.OrchType == 'Cloudify 3.4' || this.OrchType == 'Cloudify 4.0') {
			
			this.possibleInterfaces = this.VCD_CLOUDIFY_INTERFACES; 
		} else {
			
			this.possibleInterfaces = this.VCDINTERFACES; 
		}
		
	 } else{
		 
		if (this.OrchType == 'Cloudify 3.4' || this.OrchType == 'Cloudify 4.0') {
			
			this.possibleInterfaces = this.OPENSTACK_CLOUDIFY_INTERFACES; 
		} else {
			
			this.possibleInterfaces = this.OPENSTACKINTERFACES; 
		}
	 	 
		 $scope.DisplayTooltip = true;
	 }
	 
	 // console.log("possibleInterfaces");
	 //console.log(this.possibleInterfaces);
	 
	 
	for (v = 0; v < this.numberOfVMs; v++) {
		 for (i = 0; i < this.possibleNumbersOfNICs.length; i++) {
			 if( this.Interfaces[v][i] == "" || this.Interfaces[v][i] == undefined ){
					
					this.Interfaces[v][i] = this.possibleInterfaces[0];
				}
			
		 }
	} 
	 console.log(this.Interfaces);
	 
	 for (i = 0; i < this.numberOfNICs.length; i++) {
		 if( this.numberOfNICs[i] == "" || this.numberOfNICs[i] == undefined ){
				
				this.numberOfNICs[i] = this.possibleNumbersOfNICs[0];
			}
		
	 }
	 
	  console.log("Interfaces");
	  console.log(this.Interfaces);
	 
     

    
	 this.TOOLTIP = TOOLTIPS.GENERAL_NIC;

     //const lastIndex = this.possibleNumbersOfNICs[this.possibleNumbersOfNICs.length-1]-1;;
     //const prelastIndex = this.possibleNumbersOfNICs[this.possibleNumbersOfNICs.length -1] -5;

     //this.enumarated = new Array(lastIndex + 1);
	 //alert(lastIndex);
	 //alert(prelastIndex)
     
     //$scope._localIndices = angular.copy(this.indices);

     /*for (let i = 0; i < lastIndex+1; ++i) {
       this.NICshow[i] = true;
     }*/

     /*for (let index = lastIndex; index >= prelastIndex; index--) {
	   
       this.NICshow[this.indices[index]] = this.numberOfNICs  > index;
     }*/
	
	  if (this.OrchType == 'OSM 3.0' || this.OrchType == 'RIFT.ware 5.3'){	
		this.NIC_PLACEHOLDER = ['Enter Mgmt NIC','Enter NIC name','Enter NIC name','Enter NIC name','Enter NIC name','Enter NIC name'];
		
	 } else{
	 	 this.NIC_PLACEHOLDER = ['Enter NIC name','Enter NIC name','Enter NIC name','Enter NIC name','Enter NIC name','Enter NIC name'];
	 }
     
	 this.INTERFACE_PLACEHOLDER = "Select Type";
	 this.INTERFACE_TOOLTIP= TOOLTIPS.NIC_INTERFACE_TOOLTIP;

     /*angular.element(document).ready(() => {
	   //alert("jquery");
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
*/
	//$scope.update = function(ind) {
	//	$scope.vnnum = i;
	//	alert(ind);
	//}
	
    $scope.$watch(() => {
		//alert(this.numberOfNICs[0]);
		for (i = 0; i < this.numberOfVMs; i++) {
				this.NICshow[i] = [];
			for (j = 0; j < this.numberOfNICs[i]; j++) {
				this.NICshow[i][j] = true;
				}
		}
		
		// alert("watch");
      /* for(let index = lastIndex; index >= prelastIndex; index--) {
         this.NICshow[$scope.vnnum][$scope._localIndices[index]] = this.numberOfNICs[$scope.vnnum] > index;
				 
       }*/
	   
     });

     
	 
	this.forms = {};
	this.formSubmit = false;
	// ########
	dataService.setSubmitCallback( function () {
		this.formSubmit = true;

		var isValid = this.forms.nicDefinitionForm.$valid;
		//alert(isValid)
		this.validCnt = 0;
		var totalFormCnt = this.numberOfVMs * this.numberOfNICs;
		//alert(totalFormCnt);
	  
		for (i = 0; i < this.numberOfVMs; i++) { 
		    for (n = 0; n < this.numberOfNICs[i]; n++) {
		        if(this.NICs[i][n] == 'Select Type'){
			     this.validCnt++;
			     console.log("error nic" + i + n )
                        }else if(this.Interfaces[i][n] == 'Select Type'){
			         //console.log(InterfaceName +"|" + NetworkName)
			         this.validCnt++;
			         console.log("error Type" + i + n )
			}
				 //alert(isValid);
                   }
		}
	  
		if(isValid && this.validCnt){
			isValid = false ;
			console.log("My Isvalid" + isValid)
		}
	  //alert(isValid)
	
//	isValid = false ;
      if( isValid ) {
		  
		  
	      for (i = 0; i < this.numberOfVMs; i++) { 
		      for (j = 0; j < this.Interfaces.length; j++) {
			
			      if( this.Interfaces[i][j] == 'Select Type'){
				      this.Interfaces[i][j] = "";
			      }
		      }
	      }
		
	      for (i = 0; i < this.numberOfVMs; i++) { 
		      for (j = 0; j < this.NICs.length; j++) {
			      if( this.NICs[i][j] == 'Select Type'){
				      this.NICs[i][j] = "";
			      }
		      }
	      }
				
	      const config = {
			numberOfNICs: this.numberOfNICs,
		        NICs: this.NICs,
			Interfaces: this.Interfaces,
			NICsIndices: this.indices
	      };

	      dataService.setNICs( config);
      }
	   //console.log(config);
	   // console.log(isValid);
      console.log(dataService.getNicDefintion());
      return isValid;
    }.bind(this));
   }
};
