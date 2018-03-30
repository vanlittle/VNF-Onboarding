/*########################################################################
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
 
##################################################################### */
module.exports = function ($http,$state,dataService) {
    "ngInject";

    this.loginObj = {
        isAuthenticated: false,
        username :'',
        session_key : Math.random()        
    };

    this.login = function (username, password,callback) {

        var userCredentials = {
            'username'    : username,
            'password'    : password,
	    'session_key' : this.loginObj.session_key
        };
console.log(userCredentials);
console.log(this.loginObj);
        $http({
            method: 'POST',
            url: 'http://' + location.hostname + ':5000' + '/backend' + '/login',
            data: JSON.stringify(userCredentials)
        }).then(function successCallback(successResponse) {
            let serviceResult = successResponse.data;                       
            callback(serviceResult);
        }, function errorCallback(errorResponse) {
            callback(errorResponse.data);
        });
    };
console.log(this.loginObj);

    this.logOut = function () {
        this.loginObj.isAuthenticated = false;
		if( dataService.update() ) {
			dataService.populateData();
		}
		
        $state.go('login');
    };
/*
    this.changeAuth = function () {
        this.loginObj.isAuthenticated = false;
    };
*/

    this.getUserName = function(){
        return this.loginObj.username;
    };

   this.getSessionKey = function() {
      console.log("getSessionKey() called");
      console.log(this.loginObj);
      return this.loginObj.session_key;
   };
};



