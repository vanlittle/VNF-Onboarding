module.exports = function routesConfig($stateProvider, $urlRouterProvider, $locationProvider) {
  "ngInject";

  //$locationProvider.html5Mode(true).hashPrefix('!');
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('login', {
      url: '/login',
      component: 'login'
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
          }
        }
      }
    });


  //$urlRouterProvider.otherwise('/w/vnf');
  $urlRouterProvider.otherwise('/login');
};
