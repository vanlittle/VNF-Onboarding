module.exports = {
  template: require('../templates/wizard.html'),
  controller: function (navigationService,authService) {
    "ngInject";

    this.navigationService = navigationService;
    this.authService = authService;
  }
};


