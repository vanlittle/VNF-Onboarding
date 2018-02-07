/**
 * Created by jakub on 1/26/17.
 */

module.exports = function (dataService, $state) {
    "ngInject";

    this.currPath = 0;
	this.state_path;

    this.changeRoute = function( pathId ) {
      this.currPath = pathId;
      this.updatePath()
    };

    this.links = [
      {name: 'VNF definitions', href: 'wizard.vnf', button:'Continue'},
      {name: 'NIC Definitions', href: 'wizard.nic_definitions', button: 'Continue'},
      {name: 'EPA Configurations', href: 'wizard.epa_configurations', button: 'Continue'},
      {name: 'Scripts', href: 'wizard.scripts', button: 'Continue'},
      {name: 'Summary', href: 'wizard.summary', button: 'Generate'},
      {name: 'Generate', href: 'wizard.generate', button: 'Create new'}
    ];
    
	this.epas = [
      {name: 'EPA VCloud TOSCA', href: 'wizard.epa_configurations_vc_tosca', button:'Continue'},
      {name: 'EPA VCloud CLOUDIFY', href: 'wizard.epa_configurations_vc_cloudify', button:'Continue'},
	  {name: 'EPA VCloud OSM', href: 'wizard.epa_configurations_vc_osm', button:'Continue'},
      {name: 'EPA OpenStack TOSCA', href: 'wizard.epa_configurations_os_tosca', button:'Continue'},
	  {name: 'EPA OpenStack CLOUDIFY', href: 'wizard.epa_configurations_os_cloudify', button:'Continue'},
	  {name: 'EPA OpenStack OSM', href: 'wizard.epa_configurations_ost_osm', button:'Continue'}	    
    ];
	
    this.prevPath = function(){
      dataService.update();

      this.currPath = this.currPath - 1;
      this.updatePath()
    };

    this.nextPath = function() {
      if( dataService.update() ) {
        if (this.currPath + 1 === this.links.length) {
          this.currPath = 0;
          dataService.populateData();
        } else {
          this.currPath = this.currPath + 1;
        }

        this.updatePath()
      }
    };

    this.updatePath = function()  {

      //alert(this.links[this.currPath].href);
      //alert(this.currPath);
	  //var num = 3 
	  //alert(num);
	  if (this.currPath === 2){
		  
		  //alert("inside select epa");
		  this.state_path = this.selectepa();
	  }else { 
	      //alert("inside normal");
	      this.state_path = this.links[this.currPath].href;
	  }
	  
	  //alert(this.state_path);
      //$state.go(this.links[this.currPath].href);
      $state.go(this.state_path);
    }
	
	this.selectepa = function() {
		
	   var config_data = dataService.getVnfDefinition();
	   var path;
       this.VIMType = config_data.VIMType;
       this.OrchType = config_data.OrchType;	
       //VIMType = ['vCloud Director', 'OpenStack'];
       //OrchType = ['TOSCA 1.1', 'Cloudify 3.4', 'OSM 3.0'];	
       //alert('I am in')	   ;
	    //alert(this.VIMType);
		//alert(this.OrchType);
	   if (this.VIMType === 'vCloud Director' && this.OrchType === 'TOSCA 1.1') {
		   
		   path = this.epas[0].href;
		   		   
	   }else if (this.VIMType === 'vCloud Director' && this.OrchType === 'Cloudify 3.4') {
		   
		   path = this.epas[1].href;
		   
	   }else if (this.VIMType === 'vCloud Director' && this.OrchType === 'OSM 3.0') {
		   
		   path = this.epas[2].href;
		   
	   }else if (this.VIMType === 'OpenStack' && this.OrchType === 'TOSCA 1.1') {
		   
		   path = this.epas[3].href;
		   
	   }else if (this.VIMType === 'OpenStack' && this.OrchType === 'Cloudify 3.4') {
		   
		   path = this.epas[4].href;
		   
	   }else if (this.VIMType === 'OpenStack' && this.OrchType === 'OSM 3.0') {
		   
		   path = this.epas[5].href;
		   
	   }
	   
	   return path ;
				
	}
};
