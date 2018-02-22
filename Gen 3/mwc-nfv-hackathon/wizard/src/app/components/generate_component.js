//#######################################################################
//##
//# Copyright 2017-2018 VMware Inc.
//# This file is part of VNF-ONboarding
//# All Rights Reserved.
//#
//# Licensed under the Apache License, Version 2.0 (the "License"); you may
//# not use this file except in compliance with the License. You may obtain
//# a copy of the License at
//#
//#         http://www.apache.org/licenses/LICENSE-2.0
//#
//# Unless required by applicable law or agreed to in writing, software
//# distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
//# WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
//# License for the specific language governing permissions and limitations
//# under the License.
//#
//# For those usages not covered by the Apache License, Version 2.0 please
//# contact:  osslegalrouting@vmware.com
// 
//##
// 
//###########################################################################

const fileSaver = require('file-saver');
const saveAs = fileSaver.saveAs;

const TOOLTIPS = require('../config/tooltips.json');

module.exports = {
  template: require('../templates/generate.html'),
  controller: function (dataService, $scope) {
    "ngInject";

	const config = dataService.getgitUpload();
	$scope.UploadGit = config.UploadGit;
	$scope.gitUpload = false;
	this.GIT_TOOLTIP = TOOLTIPS.GIT_TOOLTIP;
	this.DOWNLOAD_TOOLTIP = TOOLTIPS.DOWNLOAD_TOOLTIP;
	this.PACKAGE_UPLOAD_INFO = TOOLTIPS.PACKAGE_UPLOAD_INFO;
	
    dataService.setSubmitCallback(function () {
      return true;
    });

    this.saveToFile = function () {
	  var config = {
         UploadGit: $scope.UploadGit
        };	
		
	  console.log(config);
	  dataService.setgitUpload(config);
      dataService.sendData((data, name) => {
        const blob = new Blob([data], {type: "application/x-gzip;charset=utf-8"});
        saveAs(blob, name);
      });
    };
  }
};
