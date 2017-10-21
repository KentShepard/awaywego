import angular from 'angular';
// components used by this module

// imports for this component
import template from './event.html';
import './event.css';

class EventController {
  constructor() {
  }
}

const EventComponent = {
  restrict: 'E',
  bindings: {
    event: '<'
  },
  template: template,
  controller: EventController
};

export default EventComponent;