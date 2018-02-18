//###########################################################################
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
//#############################################################################

module.exports = function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  "ngInject";

  //$locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('login', {
      url: '/login',
      component: 'login'
    })
    .state('signup', {
      url: '/signup',
      component: 'signup'
    })
    .state('wizard', {
      url: '/w/',
      component: 'wizard'
    })
    .state('wizard.vnf', {
      url: 'vnf',
      component: 'vnf',
      resolve: {
        pathChanger: function (navigationService,authService) {
          "ngInject";                    
          if(authService.loginObj.isAuthenticated){
            navigationService.currPath = 0;
          }else{
            authService.logOut();
	    $state.go('/login');
          }          
        }
      },
    })
    .state('wizard.nic_definitions', {
      url: 'nic_definitions',
      component: 'nic',
      resolve: {
        pathChanger: function (navigationService,authService) {
          "ngInject";
          if(authService.loginObj.isAuthenticated){
            navigationService.currPath = 1;
          }else{
            authService.logOut();
	    $state.go('/login');
          }
          
        }
      }
    })
    .state('wizard.epa_configurations', {
      url: 'epa_configurations',
      component: 'epa',
      resolve: {
        pathChanger: function (navigationService,authService) {
          "ngInject";
          if(authService.loginObj.isAuthenticated){
            navigationService.currPath = 2;
          }else{
            authService.logOut();
	    $state.go('/login');
          }
         
        }
      }
    })
	.state('wizard.epa_configurations_vc_tosca', {
      url: 'epa_configurations_vc_tosca',
      component: 'epavct',
      resolve: {
        pathChanger: function (navigationService,authService) {
          "ngInject";
          if(authService.loginObj.isAuthenticated){
            navigationService.currPath = 2;
          }else{
            authService.logOut();
            $state.go('/login');		
          }
                 
        }
      },
    })
	.state('wizard.epa_configurations_os_tosca', {
      url: 'epa_configurations_os_tosca',
      component: 'epaost',
      resolve: {
        pathChanger: function (navigationService,authService) {
          "ngInject";
          if(authService.loginObj.isAuthenticated){
            navigationService.currPath = 2;
          }else{
            authService.logOut();
	    $state.go('/login');
          }
                 
        }
      },
    })
	.state('wizard.epa_configurations_vc_osm', {
      url: 'epa_configurations_vc_osm',
      component: 'epavcs',
      resolve: {
        pathChanger: function (navigationService,authService) {
          "ngInject";
          if(authService.loginObj.isAuthenticated){
            navigationService.currPath = 2;
          }else{
            authService.logOut();
	    $state.go('/login');
          }
                   
        }
      },
    })
	
	.state('wizard.epa_configurations_ost_osm', {
      url: 'epa_configurations_ost_osm',
      component: 'epaostosm',
      resolve: {
        pathChanger: function (navigationService,authService) {
          "ngInject";
        if(authService.loginObj.isAuthenticated){
            navigationService.currPath = 2;
          }else{
            authService.logOut();
	        $state.go('/login');
          }         
        }
      },
    })
    	.state('wizard.epa_configurations_os_cloudify', {
      url: 'epa_configurations_os_cloudify',
      component: 'epaoscloudify',
      resolve: {
        pathChanger: function (navigationService,authService) {
          "ngInject";
		if(authService.loginObj.isAuthenticated){
            navigationService.currPath = 2;
          }else{
            authService.logOut();
	        $state.go('/login');
          
        }
       }
      },
    })
	
	.state('wizard.epa_configurations_vc_cloudify', {
      url: 'epa_configurations_vc_cloudify',
      component: 'epavccloudify',
      resolve: {
        pathChanger: function (navigationService,authService) {
          "ngInject";
		if(authService.loginObj.isAuthenticated){
            navigationService.currPath = 2;
          }else{
            authService.logOut();
	        $state.go('/login');
          
        }
       }
      },
    })
    .state('wizard.scripts', {
      url: 'scripts',
      component: 'scripts',
      resolve: {
        pathChanger: function (navigationService,authService) {
          "ngInject";          
          if(authService.loginObj.isAuthenticated){
            navigationService.currPath = 3;
          }else{
            authService.logOut();
	    $state.go('/login'); 
          }
        }
      }
    })
    .state('wizard.summary', {
      url: 'summary',
      component: 'summary',
      resolve: {
        pathChanger: function (navigationService,authService) {
          "ngInject";          
          if(authService.loginObj.isAuthenticated){
            navigationService.currPath = 4;
          }else{
            authService.logOut();
	        $state.go('/login');
          }
        }
      }
    })
    .state('wizard.generate', {
      url: 'generate',
      component: 'generate',
      resolve: {
        pathChanger: function (navigationService,authService) {
          "ngInject";
          
          if(authService.loginObj.isAuthenticated){
            navigationService.currPath = 5;
          }else{
            authService.logOut();
	        $state.go('/login');
          }
        }
      }
    });


  //$urlRouterProvider.otherwise('/w/vnf');
  $urlRouterProvider.otherwise('/login');
};
