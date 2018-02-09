/**
 * Created by jakub on 1/19/17.
 */
const TOOLTIPS = require('../config/tooltips.json');

module.exports = {
  template: require('../templates/epa_configuration_vc_osm.html'),
  controller: function ( dataService, $scope) {
    "ngInject";

	const config_vnf = dataService.getVnfDefinition();
	
	const config = dataService.getNicDefintion();
	this.numberOfNICs = config.numberOfNICs;
    $scope.NICs = config.NICs;
    this.indices = config.NICsIndices;
	console.log(config);
	
	//this.NICs = ['eth0','eth1','eth2']
	//this.NICs = config.VIMType;
	alert($scope.NICs);
	
	this.VIMType = config_vnf.VIMType;
	this.OrchType = config_vnf.OrchType;
	//alert(this.numberOfNICs);
	//alert(typeof this.NICs.length)
	//const last = this.NICs.length ;
	//this.NICsmy = [];
	///for (i = 0; i < last ; i++) {
	   //if (typeof NICs[i] !== 'undefined' && NICs[i] !== null){	
	 //  alert(typeof this.NICs[i]);
	//	this.NICsmy[i] = this.NICs[i];
	//	alert('harsh')
		//alert(i)
	//	alert(this.NICsmy[i]);
	   //}
     //}
	 
	
	
	dataService.setSubmitCallback( function () {
		
		return true;
		
	}.bind(this));
  }
};
