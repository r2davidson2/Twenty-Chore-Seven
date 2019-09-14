const app = angular.module('Chores', []);

app.controller('ChoresController', ['$http', function($http) {
   const controller = this;

   this.includeRoute = ''

   this.changeRoute = (route) => {
      this.includeRoute = `partials/${route}.html`
   }

   // --------------
   //  AUTH ROUTES
   // --------------
   this.createParent = function(){
      $http({
         method: 'POST',
         url: '/users/parent',
         data: {
            username: this.createUsername,
            password: this.createPassword,
            admin: true
         }
      }).then(function(response) {
         // console.log(response);
         if (response.status === 200) {
            alert('User already exists!');
         }
         controller.createUsername = null;
         controller.createPassword = null;
      }, function(error) {
         console.log(error);
      })
   };

   this.createChild = function(){
      $http({
         method: 'POST',
         url: '/users/child',
         data: {
            username: this.createUsername,
            password: this.createPassword,
            parent: controller.loggedInUserId,
            chores: [],
            points: 0,
            admin: false
         }
      }).then(function(response) {
         // console.log(response);
         if (response.status === 200) {
            alert('User already exists!');
         }
         controller.createUsername = null;
         controller.createPassword = null;
      }, function(error) {
         console.log(error);
      })
   };

   this.logIn = function() {
      $http({
         method: 'POST',
         url: '/sessions',
         data: {
            username: this.username,
            password: this.password
         }
      }).then(
         function(response) {
            // console.log(response);
            controller.username = null;
            controller.password = null;
            controller.loadPage();
         }, function(error) {
            if (error.status === 401) {
               alert('Username or password is incorrect.')
            }
         }
      )
   };

   this.loadPage = function() {
      $http({
         method: 'GET',
         url: '/app'
      }).then(
         function(response) {
            // console.log(response.data._id);
            controller.getChildren();
            controller.includeRoute = 'partials/welcome.html'
            controller.loggedInUserId = response.data._id;
         }, function(error) {
            console.log(error);
         }
      )
   }

   this.logout = function() {
      $http({
         method: 'DELETE',
         url: '/sessions'
      }).then(
         function(response) {
            console.log(response);
            controller.loggedInUserId = null;
         }, function(error) {
            console.log(error);
         }
      )
   };

   // --------------
   // CHORES ROUTES
   // --------------
   this.chores = [];
   this.children = [];

   this.showChores = function() {
      $http({
         method: 'GET',
         url: '/chores'
      }).then(
         (response) => {
            this.chores = response.data;
            console.log(this.chores);
         }
      )
   };

   this.addChore = function(child) {
      $http({
         method: 'POST',
         url: '/chores',
         data: {
            task: this.task,
            points: this.points,
            monday: this.monday,
            tuesday: this.tuesday,
            wednesday: this.wednesday,
            thursday: this.thursday,
            friday: this.friday,
            satday: this.saturday,
            sunday: this.sunday,
            createdBy: this.loggedInUserId
         }
      }).then((response) => {
         child.data.chores.unshift(response.data);
         this.resetForm();
      })
   }

   this.getChildren = function() {
         $http({
            method: 'GET',
            url: '/users/child'
         }).then((response) => {
            console.log(response.data);
            this.children = response.data
            console.log(this.children);
         })
   };

   this.resetForm = function() {
      this.task = null;
      this.points = null;
      this.monday = null;
      this.tuesday = null;
      this.wednesday = null;
      this.thursday = null;
      this.friday = null;
      this.saturday = null;
      this.sunday = null;
      this.loggedInUserId = null;
   }

   // this.getChildren();

}])
