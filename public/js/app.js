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
   this.loggedInUser = null;

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
            controller.loggedInUser = response.data;
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
            controller.loggedInUser = null;
            controller.child = null;
            controller.changeRoute('')
         }, function(error) {
            console.log(error);
         }
      )
   };

   // --------------
   // CHORES ROUTES
   // --------------
   this.chore;
   this.chores = [];
   this.children = [];
   this.child = null;

   this.deleteChore = function() {
      $http({
         method: 'GET',
         url: '/chores'
      }).then(
         (response) => {
            console.log(this.chores);
         }
      )
   };

   this.addChore = function() {
      $http({
         method: 'PUT',
         url: '/users/child/' + controller.child._id,
         data: {
                  task: this.task,
                  points: this.points,
                  monday: this.monday,
                  tuesday: this.tuesday,
                  wednesday: this.wednesday,
                  thursday: this.thursday,
                  friday: this.friday,
                  saturday: this.saturday,
                  sunday: this.sunday,
                  createdBy: this.loggedInUserId
               }
      }).then((response) => {
         controller.showChild(this.child);
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

   this.showChild = function(child) {
      $http({
         method: 'GET',
         url: '/users/child/' + child._id
      }).then((response) => {
         console.log('clicked');
         // console.log(response.data);
         this.child = response.data;
         this.chores = response.data.chores
         controller.includeRoute = 'partials/showChild.html'
         // console.log(this.child);
      })
   }

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
