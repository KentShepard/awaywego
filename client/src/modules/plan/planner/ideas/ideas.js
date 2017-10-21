import angular from 'angular';

import IdeaComponent from './single-idea/idea';
// imports for this component
import template from './ideas.html';



class IdeasController {
  constructor() {
    this.title = 'This is the ideas component';
  }
}
IdeasController.$inject = [];

const IdeasComponent = {
  restrict: 'E',
  bindings: {},
  template: template,
  controller: IdeasController
};

const IdeasModule = angular.module('app.plan.planner.ideas', [])
  .component('ideas', IdeasComponent)
  .component('idea', IdeaComponent);


export default IdeasModule.name;
