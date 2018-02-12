/**
 * Created by jakub on 1/19/17.
 */
const TOOLTIPS = require('../config/tooltips.json');

module.exports = {
  template: require('../templates/epa_configuration.html'),
  controller: function ( dataService) {
    "ngInject";

    this.FORM_SUBMIT_CLASS = 'submit';
    this.NO_CLASS = '';
    this.DISABLED_FORM_GROUP = 'form-group disabled';
    this.FORM_GROUP = 'form-group';
    this.INPUT_PLACEHOLDER = "Type here";
    this.EPA1_TOOLTIP = TOOLTIPS.EPA1_TOOLTIP
    this.EPA2_TOOLTIP = TOOLTIPS.EPA2_TOOLTIP
    this.EPA3_TOOLTIP = TOOLTIPS.EPA3_TOOLTIP

    const config_nic = dataService.getNicDefintion();
	const config = dataService.getNicDefintion();
	this.possibleNumbersOfNICs = [3,4,5];
	this.numberOfNICs = config.numberOfNICs;
	alert(this.numberOfNICs)
	this.nics = config_nic.NICs
	alert("harsh")
	alert(this.nics)

    this.epa1Type = this.nics;
	alert(this.epa1Type)
    this.epa1TypeSelected = config.epa1Type;
    this.epa2Type= config.epa2Type;
    this.epa3Type= config.epa3Type;
    
    this.forms = {};
    this.formSubmit = false;


    dataService.setSubmitCallback( function () {
      this.formSubmit = true;

      var isValid = this.forms.epaConfigurationsForm.$valid;

      if( isValid ) {
        var config = {
          epa1Type: this.epa1TypeSelected,
          epa2Type: this.epa2Type,
          epa3Type: this.epa3Type,
        };

        dataService.setVNF( config);
      }

      return isValid;
    }.bind(this));
  }
};
