import angular from 'angular';

// import services for this modules
import momentPicker from 'angular-moment-picker';

// imports for this component
import AddressSearchComponent from '../../../address-search/address-search';
import template from './promote-idea.html';
import './promote-idea.css';

class PromoteIdeaController {
  constructor(EventService, $stateParams, $state, MomentService) {
    this.EventService = EventService;
    this.stateParams = $stateParams;
    this.state = $state;
    this.moment = MomentService.moment;
    this.$onInit = this.$onInit.bind(this);
    this.formWarning = '';
    this.addressName = '';
    this.addressText = '';
    this.addressLink = '';
    this.startTime = new Date();
    this.milliseconds = this.startTime.getTime() + (60 * 60 * 1000);
    this.endTime = new Date(this.milliseconds);
    this.onStartDateChange = this.onStartDateChange.bind(this);
  }

  $onInit() {
    if (this.stateParams.eventId === 'new') {
      this.event = {};
      this.event.groupId = this.stateParams.groupId;
      this.event.imageUrl = '';
    } else {
      this.event = this.EventService.getEvent(this.stateParams.eventId);
    }
  }

  onStartDateChange() {
    this.milliseconds = this.startTime.getTime() + (60 * 60 * 1000);
    this.endTime = new Date(this.milliseconds);
  }

  submit() {
    if (this.validateForm()) {
      let promotedIdea = this.event;
      promotedIdea.startTime = this.startTime;
      promotedIdea.endTime = this.endTime;
      promotedIdea.addressName = this.addressName;
      promotedIdea.addressText = this.addressText;
      promotedIdea.addressLink = this.addressLink;

      if (this.stateParams.eventId === 'new') {
        console.log('here');
        this.EventService.submitScheduledEvent(promotedIdea).then(resp => {
          this.state.go('app.group.home');
        }).catch(err => {
          console.log('Server error: ', err);
          this.formWarning = 'Error: please try again or contact a server admin';
        });
      } else {
        this.EventService.promoteEvent(promotedIdea).then(resp => {
          this.state.go('app.group.home');
        }).catch(err => {
          console.log('Server error: ', err);
          this.formWarning = 'Error: please try again or contact a server admin';
        });
      }
    }
  }

  //todo: add calendar limit for end time after start time.

  validateForm() {
    if (!this.event.title) {
      this.formWarning = 'Please enter a title';
    }
    if (!this.event.startTime) {
      this.formWarning = 'Please enter a start time';
      return false;
    }
    if (!this.event.endTime) {
      this.formWarning = 'Please enter an end time';
      return false;
    }
    return true;
  }
}

PromoteIdeaController.$inject = ['EventService', '$stateParams', '$state', 'MomentService'];

const PromoteIdeaComponent = {
  restrict: 'E',
  bindings: {},
  template: template,
  controller: PromoteIdeaController
};

const PromoteIdeaModule = angular.module('app.plan.planner.promoteIdea', ['moment-picker'])
  .component('promoteIdea', PromoteIdeaComponent)
  .component('addressSearch', AddressSearchComponent);

export default PromoteIdeaModule.name;
