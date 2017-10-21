import angular from 'angular';
// components used by this module

// imports for this component
import template from './idea.html';
import './idea.css';

class IdeaController {
  constructor() {
  }
}

const IdeaComponent = {
  restrict: 'E',
  bindings: {
    idea: '<'
  },
  template: template,
  controller: IdeaController
};

export default IdeaComponent;