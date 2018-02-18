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
 
############################################################################ */

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
