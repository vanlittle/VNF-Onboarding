const TOOLTIPS = require('../config/tooltips.json');

require('imports-loader?$=>jQuery!jquery-ui-sortable-npm');

 module.exports = {
   template: require('../templates/nic_definitions.html'),
   controller: function ( dataService, $scope ) {
     "ngInject";

     const config = dataService.getNicDefintion();

     this.possibleNumbersOfNICs = [3,4,5];
     this.TOOLTIP = TOOLTIPS.GENERAL_NIC;

     const lastIndex = this.possibleNumbersOfNICs[this.possibleNumbersOfNICs.length -1] -1;
     const prelastIndex = this.possibleNumbersOfNICs[this.possibleNumbersOfNICs.length -2] -1;

     this.enumarated = new Array(lastIndex + 1);

     this.numberOfNICs = config.numberOfNICs;
     this.NICs = config.NICs;
     this.indices = config.NICsIndices;
     this.NICshow = [];

     $scope._localIndices = angular.copy(this.indices);

     for (let i = 0; i < lastIndex +1; ++i) {
       this.NICshow[i] = true;
     }

     for (let index = lastIndex; index >= prelastIndex; index--) {
       this.NICshow[this.indices[index]] = this.numberOfNICs > index;
     }

     this.NIC_PLACEHOLDER = "Enter NIC name";

     angular.element(document).ready(() => {
       jQuery('.sortable').sortable().bind('sortupdate', () => {
         const temp = angular.copy(this.indices);
         jQuery('.sortable input').each(function (index, input) {
             temp[index] = +jQuery(input).attr('data-index');
         });

         $scope.$apply(function(){
           this.indices = temp;
           $scope._localIndices = angular.copy(this.indices);
         });
       });
     });

     $scope.$watch(() => {
       for(let index = lastIndex; index >= prelastIndex; index--) {
         this.NICshow[$scope._localIndices[index]] = this.numberOfNICs > index;
       }
     });

     dataService.setSubmitCallback(() => {
       const config = {
         numberOfNICs: this.numberOfNICs,
         NICs: this.NICs,
         NICsIndices: $scope._localIndices
       };
       dataService.setNICs(config);
       return true;
     });
   }
};
