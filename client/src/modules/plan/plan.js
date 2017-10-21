import angular from 'angular';

import PlanNavComponent from './plan-nav/plan-nav';
import PlanFeedComponent from './plan-feed/plan-feed';
// imports for this component
import template from './plan.html';

class PlanController {
  constructor() {
    this.title = 'This is a plan title';
  }
}
PlanController.$inject = [];

const PlanComponent = {
  restrict: 'E',
  bindings: {},
  template: template,
  controller: PlanController
};

const PlanModule = angular.module('app.plan', [])
  .component('plan', PlanComponent)
  .component('planNav', PlanNavComponent)
  .component('planFeed', PlanFeedComponent);


export default PlanModule.name;
