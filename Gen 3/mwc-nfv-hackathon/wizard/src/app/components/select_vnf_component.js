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
  template: require('../templates/select_vnf.html'),
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
    $scope.upload_blueprint_error_flag = false;
    $scope.upload_blueprint_success_flag = false;

    var config = dataService.getVnfDefinition();

    this.VIMType = ['vCloud Director', 'OpenStack'];
    this.VIMTypeSelected = config.VIMType;
	$scope.VIMTypeSelected = config.VIMType;
	
	var Opt_config = dataService.getVnfSelectBlueprint();
	this.OperationType = ['Create Blueprint', 'Upload Blueprint'];
        this.OperationTypeSelected = Opt_config.OperationType;
	console.log(this.OperationTypeSelected);
	this.numberOfVMs = Opt_config.numberOfVMs;
	
	
	$scope.OperationTypeSelected = Opt_config.OperationType;
	this.AdvanceConfigSelected = Opt_config.AdvanceConfig;
	console.log(this.AdvanceConfigSelected);
	
	this.OrchType = ['TOSCA 1.1', 'RIFT.ware 5.3', 'Cloudify 3.4','Cloudify 4.0', 'OSM 3.0'];
    this.OrchTypeSelected = config.OrchType;
	$scope.OrchTypeSelected = config.OrchType;

	console.log(" AT top ---- VIM : " + this.VIMTypeSelected + " Orch : " + this.OrchTypeSelected);
    this.vnfDescription = config.VNFDescription || this.VNFTypeSelected;
	$scope.vnfDescription = this.VNFDescription;
  
    this.VNFDname = config.VNFDname; 
    $scope.VNFDname = this.VNFDname; 
    this.uploadfile = config.uploadfile;

    this.VNFType = dataService.getVNFTypes();
    this.VNFTypeSelected = config.VNFType;

    $scope.vCPUs = dataService.getVCPUs();
    $scope.vCPUSelected = config.vCPU || '0';

    $scope.RAMs = dataService.getRAMs();
    $scope.RAMSelected = config.RAM || '1';

    $scope.Flavors = dataService.getFlavors();
    //$scope.FlavorSelected = config.Flavor || this.Flavors[Object.keys(this.Flavors)[0]];

    $scope.flavorname = config.flavorname;
    
    $scope.Disk = config.Disk || '10';

    $scope.Image = config.Image;
	
	
	// Number of VM 
	
	this.possibleNumbersOfVMs = [1,2,3,4,5,6];
	
	/// Nic defination 
	
	const config_nic = dataService.getNicDefintion();
	$scope.numberOfNICs = config_nic.numberOfNICs;
    $scope.NICs = config_nic.NICs;
    $scope.Interfaces = config_nic.Interfaces;
	this.NICsIndices = config_nic.NICsIndices;
	
	/// EPA definations
	
	const config_epa = dataService.getEpaDefintion();
	$scope.NumaAffinity = config_epa.NumaAffinity;
	$scope.MemoryReservation = config_epa.MemoryReservation;
	$scope.LatencySensitivity = config_epa.LatencySensitivity;
	$scope.NumberNumaNode = config_epa.NumberNumaNode;
	
	//this.Image = "harsh image test"
    $scope.NumberNumaNode = 0
    this.forms = {};
    this.formSubmit = false;

    
	this.isUploadBlueprint = function() {
      return this.OperationTypeSelected === this.OPERATION_TYPE;
    };
	
	
	$scope.RadioButtonChanged = function (value) {
                //If DIV is visible it will be hidden and vice versa.
				//alert(value)
                $scope.VIMTypeSelected = value ;
            }
	
	$scope.DropDownChanged = function (value) {
            //$scope.DropDownStatus = $scope.dropValue;
			//alert(value);
			$scope.OrchTypeSelected = value;
        };
			
	
	
	$scope.upload_tosca_blueprint = function(jsonobj){
		
		var obj = jsonobj.topology_template.node_templates;
		var keys = Object.keys(obj);
		//console.log(keys);
		var count = Object.keys(obj).length;
		//console.log(count);
		//console.log(obj);
		this.num_of_nic = 0;
		console.log("inside TOSCA")
		
		for (var key in keys) {
			if (keys.hasOwnProperty(key)) {
								
				if(keys[key] == 'CP1') {
					$scope.NICs[0] = obj.CP1.properties.name
					$scope.Interfaces[0] = obj.CP1.properties.type
					//$scope.numberOfNICs = $scope.numberOfNICs ;
					//console.log("CP1 : " + keys[key] + "  nic1 : " + nic1 + "  nic_interface1 : " + nic_interface1);
				}
				else if (keys[key] == 'CP2'){
					$scope.NICs[1] = obj.CP2.properties.name
					$scope.Interfaces[1]= obj.CP2.properties.type
					$scope.numberOfNICs = $scope.numberOfNICs +1 ;
					//console.log("CP2 : " + keys[key] + "  nic2 : " + nic2 + "  nic_interface2 : " + nic_interface2);
					//console.log("CP2 : " + keys[key]);
				}
				else if (keys[key] == 'CP3'){
					$scope.NICs[2] = obj.CP3.properties.name
					$scope.Interfaces[2] = obj.CP3.properties.type
					$scope.numberOfNICs = $scope.numberOfNICs +1 ;
					//console.log("CP3 : " + keys[key] + "  nic3 : " + nic3 + "  nic_interface3 : " + nic_interface3);
					//console.log("CP3 : " + keys[key]);
				}
				else if (keys[key] == 'CP4'){
					$scope.NICs[3] = obj.CP4.properties.name
					$scope.Interfaces[3] = obj.CP4.properties.type
					$scope.numberOfNICs = $scope.numberOfNICs +1 ;
					//console.log("CP4 : " + keys[key] + "  nic4 : " + nic4 + "  nic_interface4 : " + nic_interface4);
					//console.log("CP4 : " + keys[key]);
				}
				else if (keys[key] == 'CP5'){
					$scope.NICs[4] = obj.CP5.properties.name
					$scope.Interfaces[4] = obj.CP5.properties.type
					$scope.numberOfNICs = $scope.numberOfNICs +1 ;
					//console.log("CP5 : " + keys[key] + "  nic5 : " + nic5 + "  nic_interface5 : " + nic_interface5);
					//console.log("CP5 : " + keys[key]);
				}
				else if (keys[key] == 'CP6'){
					$scope.NICs[5] = obj.CP6.properties.name
					$scope.Interfaces[5] = obj.CP6.properties.type
					$scope.numberOfNICs = $scope.numberOfNICs +1 ;
					//console.log("CP6 : " + keys[key] + "  nic6 : " + nic6 + "  nic_interface6 : " + nic_interface6);
					//console.log("CP6 : " + keys[key]);
				}
				else if (keys[key] == 'VDU1'){
					var VDU1_obj = obj.VDU1.capabilities.nfv_compute.properties;
					var keys_VDU1 = Object.keys(VDU1_obj);
					console.log("Print me : " + keys_VDU1);
					
					var mem_page_size = obj.VDU1.capabilities.nfv_compute.properties.mem_page_size;
					// if mem_page_size = PREFER_LARGE then  MemoryReservation = true 
					// if mem_page_size = SMALL then  MemoryReservation = false
					//$scope.MemoryReservation
					if (mem_page_size == 'PREFER_LARGE'){
						$scope.MemoryReservation = true;
					} else{
						$scope.MemoryReservation = false;
					}
									
					$scope.NumberNumaNode = obj.VDU1.capabilities.nfv_compute.properties.numa_node_count;
					if($scope.NumberNumaNode) {
						$scope.NumaAffinity = true;	
					} else {
						$scope.NumaAffinity = false;
					}
					//$scope.NumaAffinity 
					var cpu_affinity = obj.VDU1.capabilities.nfv_compute.properties.cpu_allocation.cpu_affinity;
					// if cpu_affinity = DEDICATED then  Latency Sensitivity = true 
					// if cpu_affinity = ANY then  Latency Sensitivity = false
					if (cpu_affinity == 'DEDICATED'){
						$scope.LatencySensitivity = true;
					} else{
						$scope.LatencySensitivity = false;
					}
									
					$scope.FlavorSelected = String(obj.VDU1.capabilities.nfv_compute.properties.flavor);
					if ($scope.FlavorSelected !== null) {
						$scope.RAMSelected= String(obj.VDU1.capabilities.nfv_compute.properties.flavor.mem_size)
						$scope.Disk = obj.VDU1.capabilities.nfv_compute.properties.flavor.disk_size
						$scope.vCPUSelected= obj.VDU1.capabilities.nfv_compute.properties.flavor.num_cpus
						$scope.flavorname= obj.VDU1.capabilities.nfv_compute.properties.flavor.flavor_name
					}
					
					$scope.Image = obj.VDU1.properties.image;
				}
								//console.log(key + " -> " + keys[key]);
			}
		}
		
	}
	$scope.upload_osm_blueprint = function(jsonobj){
		
		$scope.VNFDname = jsonobj["vnfd:vnfd-catalog"].vnfd[0].name;
		$scope.vnfDescription = jsonobj["vnfd:vnfd-catalog"].vnfd[0].description;
		
		var obj = jsonobj["vnfd:vnfd-catalog"].vnfd[0].vdu[0];
		var keys = Object.keys(obj);
		console.log(keys);
		for (var key in keys) {
		
			if (keys.hasOwnProperty(key)) {
				if(keys[key] == 'interface'){
					var i = 0;	
					$.each(obj.interface, function(key, value) {
					$scope.NICs[i] = value.name;
					$scope.Interfaces[i] = value["virtual-interface"].type;
					i = i + 1 ;
					$scope.numberOfNICs = i ;
					});
				}
				else if(keys[key] == 'image'){
					$scope.Image = obj.image;
				}
				else if(keys[key] == 'guest-epa'){
					if (obj["guest-epa"]["mempage-size"] == 'PREFER_LARGE'){
						$scope.MemoryReservation = true;
					}
					else{
						$scope.MemoryReservation = false;
					}
									
					if (obj["guest-epa"]["cpu-pinning-policy"] == 'DEDICATED'){
										
						$scope.LatencySensitivity = true;
					} else{
						$scope.LatencySensitivity = false;
					}
					//if (obj["guest-epa"]["numa-node-policy"]["node-cnt"]){
					if (obj["guest-epa"].hasOwnProperty("numa-node-policy")){
						$scope.NumberNumaNode = obj["guest-epa"]["numa-node-policy"]["node-cnt"];
						$scope.NumaAffinity = true
					} 
									
				}
				else if(keys[key] == 'vm-flavor'){
					if(Object.keys(obj["vm-flavor"]).length){
						$scope.RAMSelected= String(obj["vm-flavor"]["memory-mb"] / 1024);
						$scope.Disk = obj["vm-flavor"]["storage-gb"] ;
						$scope.vCPUSelected = obj["vm-flavor"]["vcpu-count"] -1 ;
					}
									
				}
							
								
			}
		}
		
		
	}

	$scope.upload_cloudify_blueprint = function(jsonobj){
		
		var obj = jsonobj.inputs;
		var keys = Object.keys(obj);
		console.log(keys);
		var cnt = 0;
		for (var key in keys) {	
			
			if (keys.hasOwnProperty(key)) {
				if(keys[key] == 'name'){
					$scope.VNFDname = obj.name.default;
				}
				else if(keys[key] == 'template'){
					$scope.Image = obj.template.default;
				}
				else if(keys[key] == 'image_id'){
					$scope.Image = obj.image_id.default;
				} 
				else if(keys[key] == 'flavor_id'){
					$scope.FlavorSelected = obj.flavor_id.default;
				}
				else if(keys[key] == 'ram'){
					$scope.RAMSelected= String(obj.ram.default / 1024);									
				}
				else if(keys[key] == 'cpu'){
					$scope.vCPUSelected = obj.cpu.default -1 ;
				}
				else if(keys[key] == 'network1_name'){
					$scope.NICs[0] = obj.network1_name.default;
					cnt = cnt + 1 ;
					console.log(obj.network1_name.default , cnt);
				}
				else if(keys[key] == 'network2_name'){
					$scope.NICs[1] = obj.network2_name.default;
					cnt = cnt + 1 ;
					console.log(obj.network2_name.default , cnt);
				}
				else if(keys[key] == 'network3_name'){
					$scope.NICs[2] = obj.network3_name.default;
					cnt = cnt + 1 ;
					console.log(obj.network3_name.default, cnt);
				}
				else if(keys[key] == 'network4_name'){
					$scope.NICs[3] = obj.network4_name.default;
					cnt = cnt + 1 ;
					console.log(obj.network4_name.default, cnt);
				}
				else if(keys[key] == 'network5_name'){
					$scope.NICs[4] = obj.network5_name.default;
					cnt = cnt + 1 ;
					console.log(obj.network5_name.default, cnt);
				}
				else if(keys[key] == 'network6_name'){
					$scope.NICs[5] = obj.network6_name.default;
					cnt = cnt + 1 ;
					console.log(obj.network6_name.default, cnt);
				}
								
			}
			
		
		}
		
		if (cnt){
			$scope.numberOfNICs = cnt ;
		}
	}

    $scope.fileName = '';
    this.ReadYaml = function (vim, orch) {
		
		var Yamlfile = document.getElementById("myFileInput").files[0];
		console.log("VIM : " + vim + " Orch : " + orch);
		//alert(vim);
		//alert(orch);
		$scope.VIMTypeSelected = vim;
		$scope.OrchTypeSelected = orch;
	  
		if (Yamlfile) {
			var aReader = new FileReader();
			aReader.readAsText(Yamlfile, "UTF-8");
			aReader.onload = function (evt) {
				$scope.fileContent = aReader.result;
				//console.log($scope.fileContent);
				console.log( "YAML to JASON" );
				try {
					var obj = yaml.safeLoad( aReader.result);
					var JSONString = JSON.stringify(obj ,null, 2);
					//console.log(myJSON);
					var JSONFile = JSON.parse(JSONString);
					//console.log(myJSON1);
					
					console.log("VIM : " + $scope.VIMTypeSelected + " Orch : " + $scope.OrchTypeSelected);
					if($scope.OrchTypeSelected == 'OSM 3.0') {
					//if($scope.OrchTypeSelected == 'OSM 3.0') {			
						console.log("inside osm and vcd");
						$scope.upload_osm_blueprint(JSONFile);
						console.log("inside OSM")
					}
					else if($scope.OrchTypeSelected == 'TOSCA 1.1') {
					//else if($scope.OrchTypeSelected == 'TOSCA 1.1') {
						
						//var impt = myJSON1.imports[0];
						$scope.upload_tosca_blueprint(JSONFile)
					}
					//else if($scope.VIMTypeSelected == 'vCloud Director' &&  $scope.OrchTypeSelected == 'Cloudify 3.4') {
					else if($scope.OrchTypeSelected == 'Cloudify 3.4' || $scope.OrchTypeSelected == 'Cloudify 4.0') {	
									
						//var impt = myJSON1.imports[0];
						$scope.upload_cloudify_blueprint(JSONFile)
					}
                                        $scope.upload_blueprint_success_flag = true;
                                        this.responseText = '<span style="color:green">Blueprint uploaded sucessfully</span>';
                                        document.getElementById("uploadresponse").innerHTML = this.responseText;

					
				} catch (e) {
					console.log(e);
                                        $scope.upload_blueprint_error_flag = true;
                                        console.log($scope.upload_blueprint_flag);
                                        this.responseText = '<span style="color:red">Error while uploading. Please check the file you have uploaded </span>';
                                        document.getElementById("uploadresponse").innerHTML = this.responseText;
				}
                                //this.responseText = "Blueprint uploaded sucessfully";
                                //document.getElementById("uploadresponse").innerHTML = this.responseText;

			}
			aReader.onerror = function (evt) {
				$scope.fileContent = "error";
                                console.log(" i am here read error");
			}
		}
	  //console.log("Inside Orch type" + this.harsh1);
	  //console.log("Inside all config" + this.config_all.vCPU);
	  console.log("after all config" );
    }
	

    this.isUploadError = function() {
         return $scope.upload_blueprint_error_flag;
         //alert($scope.upload_blueprint_error_flag)
        }
        	
    
    this.isUploadSuccess = function() {
         return $scope.upload_blueprint_success_flag;
        // alert($scope.upload_blueprint_success_flag);
        }
    
		
    dataService.setSubmitCallback( function () {
      //alert($scope.upload_blueprint_flag)
      this.formSubmit = true;
	  //alert("");
      var isValid = this.forms.vnfDefinitionForm.$valid;
	 // alert("isValid" + isValid)
	  //var isValid = true;

      if( isValid ) {
		  
		if(this.VIMTypeSelected == 'vCloud Director' || (this.VIMTypeSelected == 'OpenStack' &&  this.OrchTypeSelected == 'OSM 3.0')) {
			this.FlavorSelected = "";
			this.flavorname = "";
		}
		
		if((this.FlavorSelected != 'auto' && ( this.VIMTypeSelected == 'OpenStack' &&  (this.OrchTypeSelected == 'TOSCA 1.1' || this.OrchTypeSelected == 'Cloudify 3.4' || this.OrchTypeSelected == 'Cloudify 4.0' || this.OrchTypeSelected == 'RIFT.ware 5.3')))){
			this.Disk = "";
			this.RAMSelected = "";
			this.vCPUSelected = "";
			this.flavorname = "";
		}
		
	var vnf_config = {
          VIMType: this.VIMTypeSelected,
          OrchType: this.OrchTypeSelected,
          VNFType: this.VNFTypeSelected,
          VNFDescription: $scope.vnfDescription,
          VNFDname: $scope.VNFDname,        
          Image: $scope.Image,
          vCPU: $scope.vCPUSelected,
          RAM: $scope.RAMSelected,
          Disk: $scope.Disk,
          Flavor: $scope.FlavorSelected,
          flavorname: $scope.flavorname
		}
		
		var epa_config = {
		  NumberNumaNode : $scope.NumberNumaNode,
		  NumaAffinity : $scope.NumaAffinity,
		  MemoryReservation : $scope.MemoryReservation,
		  LatencySensitivity : $scope.LatencySensitivity,
		  SRIOVInterfaces:$scope.SRIOVInterfacesSelected
			  
		}
		
		var nic_config = {
		  numberOfNICs : $scope.numberOfNICs,
		  NICs :$scope.NICs , 
		  Interfaces :$scope.Interfaces,
		  NICsIndices: this.NICsIndices
		
        };
		
		 var SelectBlueprint_config = {
			numberOfVMs : this.numberOfVMs,
			OperationType : this.OperationTypeSelected,
			AdvanceConfig : this.AdvanceConfigSelected	 
		};
		console.log(vnf_config);
		console.log(nic_config);
		console.log(epa_config);
		console.log(SelectBlueprint_config);
		
		dataService.setSelectBlueprint(SelectBlueprint_config)
        dataService.setVNF( vnf_config);
		dataService.setNICs( nic_config);
		dataService.setEPA( epa_config);
      }

      return isValid;
	  //return false;
    }.bind(this));
  }
};
