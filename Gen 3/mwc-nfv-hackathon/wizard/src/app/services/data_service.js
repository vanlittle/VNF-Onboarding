/*###########################################################################
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
const FLAVORS = require('../config/flavors.json');
const OS_NETWORKS = require('../config/openstack_networks.json');
const VCD_NETWORKS = require('../config/vcd_networks.json');
const VNF_TYPES = require('../config/vnf_types.json');

module.exports = function ($http) {
  "ngInject";

  let _vnfConfiguration = {};
  let _vnfDefinition = {};
  let _nicDefinition = {};
  let __epaDefinition ={};
  let _scriptsDefinition = {};
  let _scripts = {};
  let _username = '';
  let _session_key = '';

  const _vnfTypes = VNF_TYPES;
  const _vCPUs = [1, 2, 4, 8, 16];
  const _RAMs = [1, 2, 4, 8, 16, 32, 64, 128, 256];
  const _Flavors = FLAVORS;
  const _VcdNetworks = VCD_NETWORKS;
  const _OsNetworks = OS_NETWORKS;
  
  this.populateVMData = function(numberOfVMs) {
   
	for (let i = 0; i < numberOfVMs; i++){
	}
   
 };

  this.populateData = function() {
	  
   _vnfDefinition = {
	  VIMType: 'vCloud Director',
      OrchType: 'OSM 3.0',
      OType: 'T.1',
      VNFType: 'vRouter',
      VNFDescription: '',
      VNFDname:'',  
	  numberOfVMs : 1 ,
	  VMsIndices : [0, 1, 2, 3, 4, 5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],
	  possibleNumbersOfVMs : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
      //OperationType : [0,1, 2, 3, 4, 5],
	 };
	 
	 
    _vnfConfiguration = {
      
      ImageIndices: [0, 1, 2, 3, 4, 5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],	  
      vCPU: ['', '', '', '', '','','', '', '', '', '','','', '', '', '', '','','',''],
      RAM: ['', '', '', '', '','','', '', '', '', '','','', '', '', '', '','','',''],
      Disk: ['', '', '', '', '','','', '', '', '', '','','', '', '', '', '','','',''],
      Image: ['', '', '', '', '','','', '', '', '', '','','', '', '', '', '','','',''],
      Flavor: ['', '', '', '', '','','', '', '', '', '','','', '', '', '', '','','',''],
      flavorname: ['', '', '', '', '','','', '', '', '', '','','', '', '', '', '','','','']
    };
	
	 _networkConfiguration = {
      numberOfNetworks: 1,
	  mgmtNetwork:'',
	  mgmtNetworkEthernetType:'',
      Networks: ['', '', '', '', '','','', '', '', '', '','','', '', '', '', '','','',''],
	  NewNetwork:['', '', '', '', '','','', '', '', '', '','','', '', '', '', '','','',''],
      NetworkIndices: [0, 1, 2, 3, 4, 5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],
	  NetworksType: ['', '', '', '', '','','', '', '', '', '','','', '', '', '', '','','',''],
	  EthernetType: ['', '', '', '', '','','', '', '', '', '','','', '', '', '', '','','',''],
          create_mgmt_network : false
    };
	
    _nicDefinition = {
      numberOfNICs: ['', '', '', '', '','','', '', '', '', '','','', '', '', '', '','','',''],
      NICs: [['', '', '', '', '',''], ['', '', '', '', '',''], ['', '', '', '', '',''], ['', '', '', '', '',''], ['', '', '', '', '',''],['', '', '', '', '',''],['', '', '', '', '',''], ['', '', '', '', '',''], ['', '', '', '', '',''], ['', '', '', '', '',''], ['', '', '', '', '',''],['', '', '', '', '',''],['', '', '', '', '',''], ['', '', '', '', '',''], ['', '', '', '', '',''], ['', '', '', '', '',''], ['', '', '', '', '',''],['', '', '', '', '',''],['', '', '', '', '',''],['', '', '', '', '','']],
	  Interfaces:[['Select Type', 'Select Type', 'Select Type', 'Select Type', 'Select Type','Select Type'], ['Select Type', 'Select Type', 'Select Type', 'Select Type', 'Select Type','Select Type'], ['Select Type', 'Select Type', 'Select Type', 'Select Type', 'Select Type','Select Type'], ['Select Type', 'Select Type', 'Select Type', 'Select Type', 'Select Type','Select Type'], ['Select Type', 'Select Type', 'Select Type', 'Select Type', 'Select Type','Select Type'],['Select Type', 'Select Type', 'Select Type', 'Select Type', 'Select Type','Select Type'],['Select Type', 'Select Type', 'Select Type', 'Select Type', 'Select Type','Select Type'], ['Select Type', 'Select Type', 'Select Type', 'Select Type', 'Select Type','Select Type'], ['Select Type', 'Select Type', 'Select Type', 'Select Type', 'Select Type','Select Type'], ['Select Type', 'Select Type', 'Select Type', 'Select Type', 'Select Type','Select Type'], ['Select Type', 'Select Type', 'Select Type', 'Select Type', 'Select Type','Select Type'],['Select Type', 'Select Type', 'Select Type', 'Select Type', 'Select Type','Select Type'],['Select Type', 'Select Type', 'Select Type', 'Select Type', 'Select Type','Select Type'], ['Select Type', 'Select Type', 'Select Type', 'Select Type', 'Select Type','Select Type'], ['Select Type', 'Select Type', 'Select Type', 'Select Type', 'Select Type','Select Type'], ['Select Type', 'Select Type', 'Select Type', 'Select Type', 'Select Type','Select Type'], ['Select Type', 'Select Type', 'Select Type', 'Select Type', 'Select Type','Select Type'],['Select Type', 'Select Type', 'Select Type', 'Select Type', 'Select Type','Select Type'],['Select Type', 'Select Type', 'Select Type', 'Select Type', 'Select Type','Select Type'],['Select Type', 'Select Type', 'Select Type', 'Select Type', 'Select Type','Select Type']],
      NICsIndices: [0, 1, 2, 3, 4, 5,6,7,8,9]
    };
   
     _epaDefinition = {
      NumaAffinity: [false, false, false, false, false,false,false, false, false, false, false,false,false, false, false, false, false,false,false,false],
	  MemoryReservation: [false, false, false, false, false,false,false, false, false, false, false,false,false, false, false, false, false,false,false,false],
	  LatencySensitivity: [false, false, false, false, false,false,false, false, false, false, false,false,false, false, false, false, false,false,false,false],
	  NumberNumaNode:[1,1,1, 1, 1,1,1,1,1, 1, 1,1,1,1,1, 1, 1,1,1,1],
	  SRIOVInterfaces:['', '', '', '', ''],
	  SRIOVInterfacesIndices:[1, 2, 3, 4, 5]
    };

    _scripts = {
		
      'create': [
					  {
						text: "Create Script",
						tooltip: TOOLTIPS.CREATE,
						id: 'create_url',
						name: 'create', 
						value: ''
					  }, 
					  {
						text: "Create Script",
						tooltip: TOOLTIPS.CREATE,
						id: 'create_url',
						name: 'create', value: ''
					  }, 
					  { text: "Create Script",
						tooltip: TOOLTIPS.CREATE,
						id: 'create_url',
						name: 'create', value: ''
					  }, 
					  { text: "Create Script",
						tooltip: TOOLTIPS.CREATE,
						id: 'create_url',
						name: 'create', value: ''
					  }, 
					  { text: "Create Script",
						tooltip: TOOLTIPS.CREATE,
						id: 'create_url',
						name: 'create', value: ''
					  }, 
					  { text: "Create Script",
						tooltip: TOOLTIPS.CREATE,
						id: 'create_url',
						name: 'create', value: ''
					  },
					  {
						text: "Create Script",
						tooltip: TOOLTIPS.CREATE,
						id: 'create_url',
						name: 'create', 
						value: ''
					  }, 
					  {
						text: "Create Script",
						tooltip: TOOLTIPS.CREATE,
						id: 'create_url',
						name: 'create', value: ''
					  }, 
					  { text: "Create Script",
						tooltip: TOOLTIPS.CREATE,
						id: 'create_url',
						name: 'create', value: ''
					  }, 
					  { text: "Create Script",
						tooltip: TOOLTIPS.CREATE,
						id: 'create_url',
						name: 'create', value: ''
					  }, 
					  { text: "Create Script",
						tooltip: TOOLTIPS.CREATE,
						id: 'create_url',
						name: 'create', value: ''
					  }, 
					  { text: "Create Script",
						tooltip: TOOLTIPS.CREATE,
						id: 'create_url',
						name: 'create', value: ''
					  },
					  {
						text: "Create Script",
						tooltip: TOOLTIPS.CREATE,
						id: 'create_url',
						name: 'create', 
						value: ''
					  }, 
					  {
						text: "Create Script",
						tooltip: TOOLTIPS.CREATE,
						id: 'create_url',
						name: 'create', value: ''
					  }, 
					  { text: "Create Script",
						tooltip: TOOLTIPS.CREATE,
						id: 'create_url',
						name: 'create', value: ''
					  }, 
					  { text: "Create Script",
						tooltip: TOOLTIPS.CREATE,
						id: 'create_url',
						name: 'create', value: ''
					  }, 
					  { text: "Create Script",
						tooltip: TOOLTIPS.CREATE,
						id: 'create_url',
						name: 'create', value: ''
					  }, 
					  { text: "Create Script",
						tooltip: TOOLTIPS.CREATE,
						id: 'create_url',
						name: 'create', value: ''
					  },
					  { text: "Create Script",
						tooltip: TOOLTIPS.CREATE,
						id: 'create_url',
						name: 'create', value: ''
					  }, 
					  { text: "Create Script",
						tooltip: TOOLTIPS.CREATE,
						id: 'create_url',
						name: 'create', value: ''
					  }
	  ],
      'configure':[ 
					  {
						text: "Configure Script",
						tooltip: TOOLTIPS.CONFIGURE,
						id: 'configure_url',
						name: 'configure', value: ''
					  }, {
						text: "Configure Script",
						tooltip: TOOLTIPS.CONFIGURE,
						id: 'configure_url',
						name: 'configure', value: ''
					  },{
						text: "Configure Script",
						tooltip: TOOLTIPS.CONFIGURE,
						id: 'configure_url',
						name: 'configure', value: ''
					  },{
						text: "Configure Script",
						tooltip: TOOLTIPS.CONFIGURE,
						id: 'configure_url',
						name: 'configure', value: ''
					  },{
						text: "Configure Script",
						tooltip: TOOLTIPS.CONFIGURE,
						id: 'configure_url',
						name: 'configure', value: ''
					  },{
						text: "Configure Script",
						tooltip: TOOLTIPS.CONFIGURE,
						id: 'configure_url',
						name: 'configure', value: ''
					  },
					  {
						text: "Configure Script",
						tooltip: TOOLTIPS.CONFIGURE,
						id: 'configure_url',
						name: 'configure', value: ''
					  }, {
						text: "Configure Script",
						tooltip: TOOLTIPS.CONFIGURE,
						id: 'configure_url',
						name: 'configure', value: ''
					  },{
						text: "Configure Script",
						tooltip: TOOLTIPS.CONFIGURE,
						id: 'configure_url',
						name: 'configure', value: ''
					  },{
						text: "Configure Script",
						tooltip: TOOLTIPS.CONFIGURE,
						id: 'configure_url',
						name: 'configure', value: ''
					  },{
						text: "Configure Script",
						tooltip: TOOLTIPS.CONFIGURE,
						id: 'configure_url',
						name: 'configure', value: ''
					  },{
						text: "Configure Script",
						tooltip: TOOLTIPS.CONFIGURE,
						id: 'configure_url',
						name: 'configure', value: ''
					  } ,
					  {
						text: "Configure Script",
						tooltip: TOOLTIPS.CONFIGURE,
						id: 'configure_url',
						name: 'configure', value: ''
					  }, {
						text: "Configure Script",
						tooltip: TOOLTIPS.CONFIGURE,
						id: 'configure_url',
						name: 'configure', value: ''
					  },{
						text: "Configure Script",
						tooltip: TOOLTIPS.CONFIGURE,
						id: 'configure_url',
						name: 'configure', value: ''
					  },{
						text: "Configure Script",
						tooltip: TOOLTIPS.CONFIGURE,
						id: 'configure_url',
						name: 'configure', value: ''
					  },{
						text: "Configure Script",
						tooltip: TOOLTIPS.CONFIGURE,
						id: 'configure_url',
						name: 'configure', value: ''
					  },{
						text: "Configure Script",
						tooltip: TOOLTIPS.CONFIGURE,
						id: 'configure_url',
						name: 'configure', value: ''
					  },{
						text: "Configure Script",
						tooltip: TOOLTIPS.CONFIGURE,
						id: 'configure_url',
						name: 'configure', value: ''
					  },{
						text: "Configure Script",
						tooltip: TOOLTIPS.CONFIGURE,
						id: 'configure_url',
						name: 'configure', value: ''
					  } 
	  ],
      'delete': [
					  {
						text: "Delete Script ",
						tooltip: TOOLTIPS.DELETE,
						id: 'delete_url',
						name: 'delete', value: ''
					  }, {
						text: "Delete Script ",
						tooltip: TOOLTIPS.DELETE,
						id: 'delete_url',
						name: 'delete', value: ''
					  },{
						text: "Delete Script ",
						tooltip: TOOLTIPS.DELETE,
						id: 'delete_url',
						name: 'delete', value: ''
					  },{
						text: "Delete Script ",
						tooltip: TOOLTIPS.DELETE,
						id: 'delete_url',
						name: 'delete', value: ''
					  },{
						text: "Delete Script ",
						tooltip: TOOLTIPS.DELETE,
						id: 'delete_url',
						name: 'delete', value: ''
					  },{
						text: "Delete Script ",
						tooltip: TOOLTIPS.DELETE,
						id: 'delete_url',
						name: 'delete', value: ''
					  },
					  {
						text: "Delete Script ",
						tooltip: TOOLTIPS.DELETE,
						id: 'delete_url',
						name: 'delete', value: ''
					  }, {
						text: "Delete Script ",
						tooltip: TOOLTIPS.DELETE,
						id: 'delete_url',
						name: 'delete', value: ''
					  },{
						text: "Delete Script ",
						tooltip: TOOLTIPS.DELETE,
						id: 'delete_url',
						name: 'delete', value: ''
					  },{
						text: "Delete Script ",
						tooltip: TOOLTIPS.DELETE,
						id: 'delete_url',
						name: 'delete', value: ''
					  },{
						text: "Delete Script ",
						tooltip: TOOLTIPS.DELETE,
						id: 'delete_url',
						name: 'delete', value: ''
					  },{
						text: "Delete Script ",
						tooltip: TOOLTIPS.DELETE,
						id: 'delete_url',
						name: 'delete', value: ''
					  },
					  {
						text: "Delete Script ",
						tooltip: TOOLTIPS.DELETE,
						id: 'delete_url',
						name: 'delete', value: ''
					  }, {
						text: "Delete Script ",
						tooltip: TOOLTIPS.DELETE,
						id: 'delete_url',
						name: 'delete', value: ''
					  },{
						text: "Delete Script ",
						tooltip: TOOLTIPS.DELETE,
						id: 'delete_url',
						name: 'delete', value: ''
					  },{
						text: "Delete Script ",
						tooltip: TOOLTIPS.DELETE,
						id: 'delete_url',
						name: 'delete', value: ''
					  },{
						text: "Delete Script ",
						tooltip: TOOLTIPS.DELETE,
						id: 'delete_url',
						name: 'delete', value: ''
					  },{
						text: "Delete Script ",
						tooltip: TOOLTIPS.DELETE,
						id: 'delete_url',
						name: 'delete', value: ''
					  },{
						text: "Delete Script ",
						tooltip: TOOLTIPS.DELETE,
						id: 'delete_url',
						name: 'delete', value: ''
					  },{
						text: "Delete Script ",
						tooltip: TOOLTIPS.DELETE,
						id: 'delete_url',
						name: 'delete', value: ''
					  }
	  ]
    };

    let _scriptsDefinition = {};
	
	_gitUpload ={
		
	  UploadGit: false
	}
  };

  
  this.populateData();

  this.update = function () {
    return true;
  };

  this.setSubmitCallback = function (callback) {
    this.update = callback;
  };

  this.getScripts = function () {
    return _scripts;
  };

  this.setSelectBlueprint = function (select_blueprint) {
    _vnfSelectBlueprint = select_blueprint;
  };
  
  this.setVNFD = function (vnf) {
    _vnfDefinition = vnf;
  };
  this.setVNFC = function (vnf) {
    _vnfConfiguration = vnf;
  };
  this.setNETC = function (nets) {
    _networkConfiguration = nets;
  };
  
   
  this.setNICs = function (nics) {
    _nicDefinition = nics;
  };
  
  this.setEPA = function (epa) {
    _epaDefinition = epa;
  };
  this.setScripts = function (scripts) {
    _scriptsDefinition = scripts;
  };

  this.setgitUpload = function (uploadData) {
    _gitUpload = uploadData;
  };
  
  this.getgitUpload = function () {
    return _gitUpload;
  };
  
  this.getVnfDefinition = function () {
    return _vnfDefinition;
  };
  this.getNicDefintion = function () {
    return _nicDefinition;
  };
  this.getEpaDefintion = function () {
    return _epaDefinition;
  };
  this.getScriptsDefinition = function () {
    return _scriptsDefinition;
  };
  this.getVCPUs = function () {
    return _vCPUs;
  };
  this.getRAMs = function () {
    return _RAMs;
  };
  this.getFlavors = function () {
    return _Flavors;
  };
  this.getOsNetworks = function () {
    return _OsNetworks;
  };
  this.getVcdNetworks = function () {
    return _VcdNetworks;
  };
 
  this.getVNFTypes = function () {
    return _vnfTypes;
  };
  this.getVnfConfiguration = function () {
    return _vnfConfiguration;
  };
  this.getNetworkConfiguration = function () {
    return _networkConfiguration;
  };
  
  this.setusername = function(username) {
    //console.log(username);
    _username = username;
 };

 this.setsessionkey = function(session_key) {
   //console.log(session_key);
   _session_key = session_key;
 };

  //username = authService.getUserName();
 // session_key = authService.getSessionKey().toString();
  //console.log(username);
  //console.log(session_key);

  this.sendData = function (callback) {
    $http({
      method: 'POST',
      url: 'http://' + location.hostname + ':5000' + '/backend' + '/multivdu_blueprint',
      responseType: 'arraybuffer',
      headers: {'Authorization': _session_key,'username': _username},	
      data: this.generateInputs()
    }).then(function successCallback(response) {
      //var name = _vnfDefinition.VNFType +  '-' + _vnfDefinition.OrchType + '-' + _vnfDefinition.VIMType + '.zip'
      var name = _vnfDefinition.VNFType + '-' + _vnfDefinition.VIMType + '-' +  _vnfDefinition.VNFDname + '.zip'
      callback(response.data, name);
    }, function errorCallback(response) {
      console.error(response);
    });
  };

  this.generateInputs = function () {
    const inputs = {
	  vim_params :{
		env_type: _vnfDefinition.VIMType,
        orch_type: _vnfDefinition.OrchType,
        vnf_type: _vnfDefinition.VNFType,
        vnfd_name: _vnfDefinition.VNFDname,
        vnf_description: _vnfDefinition.VNFDescription,
		mgmt_network: _networkConfiguration.mgmtNetwork,
                create_mgmt_network : _networkConfiguration.create_mgmt_network,
		mgmt_network_ethernet_type : _networkConfiguration.mgmtNetworkEthernetType,
		git_upload : _gitUpload.UploadGit 
	  },
	  
      params: []
    };
	
	for (let i = 0; i <_networkConfiguration.Networks.length; i++){
		  if (_networkConfiguration.Networks[i].trim()){
			
			inputs.vim_params['Network' + (_networkConfiguration.NetworkIndices[i] + 1) + '_name'] = _networkConfiguration.Networks[i].trim();
		  }
		}
		
	for (let i = 0; i <_networkConfiguration.NewNetwork.length; i++){
			
			
		  if (_networkConfiguration.NewNetwork[i]){
			  inputs.vim_params['Create Network' + ( i + 1 ) ] = _networkConfiguration.NewNetwork[i];
		  }
				  
		}
	
	for (let i = 0; i <_networkConfiguration.NetworksType.length; i++){
			
			
		  if (_networkConfiguration.NetworksType[i]){
			  inputs.vim_params['Network' + ( i + 1 ) + '_type' ] = _networkConfiguration.NetworksType[i];
		  }
				  
		}
	for (let i = 0; i <_networkConfiguration.EthernetType.length; i++){
			
			
		  if (_networkConfiguration.EthernetType[i]){
			  inputs.vim_params['Ethernet' + ( i + 1 ) + '_type' ] = _networkConfiguration.EthernetType[i];
		  }
				  
		}
	
	for (let v = 0; v < _vnfDefinition.numberOfVMs; v++){
		
		vm_params = {
			
			image_id: _vnfConfiguration.Image[v],
			flavor: _vnfConfiguration.Flavor[v],
			flavorname: _vnfConfiguration.flavorname[v],
			cpu: _vCPUs[_vnfConfiguration.vCPU[v]],
			disk: _vnfConfiguration.Disk[v],
			ram: _vnfConfiguration.RAM[v] * 1024,
			numa_affinity : _epaDefinition.NumaAffinity[v],
			memory_reservation: _epaDefinition.MemoryReservation[v],
			latency_sensitivity : _epaDefinition.LatencySensitivity[v],
			number_numa_node: _epaDefinition.NumberNumaNode[v],
			scripts: _scriptsDefinition
				
			
		}
		/*params[v][image_id] = _vnfConfiguration.Image[v];
		params[v][flavor] = _vnfConfiguration.Flavor[v];
		params[v][flavorname] = _vnfConfiguration.flavorname[v];
		params[v][cpu] = _vCPUs[_vnfDefinition.vCPU[v]];
		params[v][disk] = _vnfConfiguration.Disk[v];
		params[v][ram] = _vnfConfiguration.RAM[v] * 1024;
		params[v][numa_affinity] = _epaDefinition.NumaAffinity[v];
		params[v][memory_reservation] = _epaDefinition.MemoryReservation[v];
		params[v][latency_sensitivity] = _epaDefinition.LatencySensitivity[i];
		params[i][number_numa_node] = _epaDefinition.NumberNumaNode[i];
			
		vm_params['a'] = _nicDefinition.NICs[v][0];
		vm_params['b'] = _nicDefinition.NICs[v].length;
		vm_params['c'] = _nicDefinition.NICsIndices*/
			
		for (let i = 0; i <_nicDefinition.NICs[v].length; i++){
		  if (_nicDefinition.NICs[v][i].trim()){
			
			vm_params['nic' + (_nicDefinition.NICsIndices[i] + 1) + '_name'] = _nicDefinition.NICs[v][i].trim();
		  }
		}
		
		for (let i = 0; i <_nicDefinition.Interfaces[v].length; i++){
			
			
		  if (_nicDefinition.Interfaces[v][i].trim()){
			  vm_params['Interfaces' + ( i + 1 ) + '_name' ] = _nicDefinition.Interfaces[v][i].trim();
		  }
				  
		}
			
		inputs['params'].push(vm_params)
	}
	console.log("data service");
    console.log(inputs);
	console.log("data service");
    return inputs;
  };
};
