export default class AddressService {
  constructor($http) {
    this.$inject = ['$http'];
    this.$http = $http;
  }

  findLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;

      let img = new Image();
      img.src = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=10&size=400x400&key=AIzaSyC4JL3R71CHTNuCs3r0LzQQ9etGL-tQEi8`;

      document.getElementById('address').appendChild(img);
    });
  }
}