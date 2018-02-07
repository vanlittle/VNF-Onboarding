module.exports = {
  template: require('../templates/summary.html'),
  controller: function (dataService) {
    "ngInject";

    dataService.setSubmitCallback(function () {
      return true;
    });

    this.inputs = dataService.generateInputs();

    this.inputsNames = {
      'env_type': 'VIM Type',
      'vnf_type': 'VNF Type',
      'orch_type': 'Orchestrator Type',
      'vnf_name': 'VNF Name',
      'vnfd_name': 'VNF Name',
      'vnf_description': 'VNF Description',
      'cpu': 'vCPU',
      'ram': 'RAM (MB)',
      'disk': 'Disk',
      'image_id': 'Image',
      'flavor': 'Flavor',
      'username': 'username',
	  'numa_affinity' : 'Numa Affinity',
	  'memory_reservation':'Memory Reservation',
	  'latency_sensitivity':'Latency Sensitivity',
	  'number_numa_node' : 'Number of Numa Nodes',
      'config': 'Configure Script url',
      'create': 'Create Script url',
      'delete': 'Delete Script url',
      'nic1_name': 'NIC 1',
      'nic2_name': 'NIC 2',
      'nic3_name': 'NIC 3',
      'nic4_name': 'NIC 4',
      'nic5_name': 'NIC 5',
	  'SRIOVInterfaces1_name' : 'SR-IOV Enabled Interface 1',
	  'SRIOVInterfaces2_name' : 'SR-IOV Enabled Interface 2',
	  'SRIOVInterfaces3_name' : 'SR-IOV Enabled Interface 3',
	  'SRIOVInterfaces4_name' : 'SR-IOV Enabled Interface 4',
	  'SRIOVInterfaces5_name' : 'SR-IOV Enabled Interface 5'
    };
      }
};
