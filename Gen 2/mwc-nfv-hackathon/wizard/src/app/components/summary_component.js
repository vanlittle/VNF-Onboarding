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
      'image_id': 'Image',
      'vnf_description': 'VNF Description',
      'flavor': 'Flavor',
      'flavorname': 'Flavor Name',
      'cpu': 'vCPU',
      'ram': 'RAM (MB)',
      'disk': 'Disk',
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
      'nic6_name': 'NIC 6',
      'Interfaces1_name' : 'Enabled Interface 1',
      'Interfaces2_name' : 'Enabled Interface 2',
      'Interfaces3_name' : 'Enabled Interface 3',
      'Interfaces4_name' : 'Enabled Interface 4',
      'Interfaces5_name' : 'Enabled Interface 5',
      'Interfaces6_name' : 'Enabled Interface 6'
    };
      }
};
