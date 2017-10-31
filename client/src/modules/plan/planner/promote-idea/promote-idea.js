import angular from 'angular';

// import services for this modules
//import moment from 'moment';
import EventService from '../../../../services/event/event.service';
import AddressService from '../../../../services/address/address.service';
import momentPicker from 'angular-moment-picker';
import moment from 'moment';


//import DatetimePickerComponent from '../../../common/datetime-picker/datetime-picker-config';

// imports for this component
import template from './promote-idea.html';
import './promote-idea.css';

class PromoteIdeaController {
  constructor(EventService, $stateParams, $state, AddressService) {
    this.EventService = EventService;
    this.$stateParams = $stateParams;
    this.$state = $state;
    this.AddressService = AddressService;
    this.moment = moment;
    this.$onInit = this.$onInit.bind(this);
    this.formWarning = '';
    this.formattedStartTime = '';
    this.formattedEndTime = '';
    this.onEndDateChange = this.onEndDateChange.bind(this);
    this.onStartDateChange = this.onStartDateChange.bind(this);
  }

  $onInit() {
    this.event = this.EventService.getEvent(this.$stateParams.eventId);
    if (!this.event.startTime) {
      this.event.startTime = this.moment().format('MM/DD/YYYY hh:mm A');
    }
    this.formattedStartTime = this.moment(this.event.startTime).format('MM/DD/YYYY hh:mm A');
    if (!this.event.endTime) {
      this.event.endTime = this.moment().format('MM/DD/YYYY hh:mm A');
    }
    this.formattedEndTime = this.moment(this.event.endTime).format('MM/DD/YYYY hh:mm A');
  }

  onStartDateChange(newValue) {
    this.formattedStartTime = newValue.format('MM/DD/YYYY hh:mm A');
  }

  onEndDateChange(newValue) {
    this.formattedEndTime = newValue.format('MM/DD/YYYY hh:mm A');
  }

  findLocation() {
    this.AddressService.findLocation();
  }

  submit() {
    if (this.validateForm()) {
      let promotedIdea = this.event;
      promotedIdea.startTime = new Date(promotedIdea.startTime);
      promotedIdea.endTime = new Date(promotedIdea.endTime);
      this.EventService.promoteEvent(promotedIdea).then(resp => {
        this.$state.go('app.plan.planner.ideas');
      }).catch(err => {
        console.log('Server error: ', err);
        this.formWarning = 'Error: please try again or contact a server admin';
      });
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

PromoteIdeaController.$inject = ['EventService', '$stateParams', '$state', 'AddressService'];

const PromoteIdeaComponent = {
  restrict: 'E',
  bindings: {},
  template: template,
  controller: PromoteIdeaController
};

const PromoteIdeaModule = angular.module('app.plan.planner.promoteIdea', ['moment-picker'])
  .component('promoteIdea', PromoteIdeaComponent)
  .service('EventService', EventService)
  .service('AddressService', AddressService);

export default PromoteIdeaModule.name;
