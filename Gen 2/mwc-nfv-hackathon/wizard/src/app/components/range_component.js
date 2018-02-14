
//###############################################################################
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
//##############################################################################

module.exports = {
    bindings: {
      value: '=', /* 2-way binding */
      steps: '=', /* 2-way binding */
      rangeTabIndex: '='
    },
    controller: function ($scope, $timeout) {
      "ngInject";

      $timeout(() => {
        const width = 300;
        this.stepWidth = width / this.steps.length;
        this.marginBar = 35;
        this.marginDot = 18;
        this.marginDotShadow = 13;

        this.ACTIVE = 'active';
        this.NO_CLASS = '';

        this.changeValue = function (index) {
          this.value = index;
        }.bind(this);

        this.keydown = (event) => {
          if (event.keyCode == 39) { /* Right arrow */
            if (this.value < this.steps.length - 1)
              this.value++;
          }
          if (event.keyCode == 37) { /* Left arrow */
            if (this.value > 0)
              this.value--;
          }
        }
      });
    },
    template: require("../templates/range_template.html")
};
