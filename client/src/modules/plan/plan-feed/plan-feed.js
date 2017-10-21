import angular from 'angular';

// imports for this component
import template from './plan-feed.html';

class PlanFeedController {
  constructor() {
    this.planId = 'sample';
  }
}
PlanFeedController.$inject = [];

const PlanFeedComponent = {
  restrict: 'E',
  bindings: {},
  template: template,
  controller: PlanFeedController
};


export default PlanFeedComponent;