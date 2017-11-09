// preloading jquery so angular will see it
import $ from 'jquery';
window.$ = $;
window.jQuery = $;
// loading angular to window for the main app.js import
const angular = require('angular');
import uirouter from '@uirouter/angularjs';
import ngMaterial from 'angular-material';
import 'angular-material/angular-material.css';
import ngAria from 'angular-aria';
import ngAnimate from 'angular-animate';

// import other modules
import CommonModule from './modules/common/common';
import HomeModule from './modules/home/home';
import LoginModule from './modules/login/login';
import SignupModule from './modules/login/signup';
import GroupModule from './modules/group/group';
import MakeGroupModule from './modules/make-group/make-group';
import FriendsModule from './modules/friends/friends';
import CommentsModule from './modules/comments/comments';
import ImportContactsModule from './modules/import-contacts/import-contacts';

// import global services
import UserService from './services/user/user.service';
import FriendService from './services/friend/friend.service';
import MomentService from './services/moment/moment.service';
import ImageSearchService from './services/images/image.search.service';
import ConfirmService from './services/confirm/confirm.service';

// imports for this component
import appRouting from './app.routing';
import template from './app.html';
import './app.css';

// import global styles
import './styles/forms.css';

class AppController {
  constructor(UserService) {
    this.UserService = UserService;
  }
}
AppController.$inject = ['UserService'];

const AppComponent = {
  template: template,
  controller: AppController
};

angular.module('app', [
  uirouter,
  ngMaterial,
  ngAria,
  ngAnimate,
  CommonModule,
  HomeModule,
  LoginModule,
  SignupModule,
  GroupModule,
  MakeGroupModule,
  FriendsModule,
  CommentsModule,
  ImportContactsModule
])
  .service('UserService', UserService)
  .service('FriendService', FriendService)
  .service('MomentService', MomentService)
  .service('ImageSearchService', ImageSearchService)
  .service('ConfirmService', ConfirmService)
  .component('app', AppComponent)
  .config(appRouting)
  .config(['$mdThemingProvider', function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('blue')
      .accentPalette('blue');
  }]);
