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
            username: this.createUsername.toLowerCase(),
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
            username: this.createUsername.toLowerCase(),
            password: this.createPassword,
            parent: controller.loggedInUser._id,
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
         controller.loadPage();
      }, function(error) {
         console.log(error);
      })
   };

   this.logIn = function() {
      $http({
         method: 'POST',
         url: '/sessions',
         data: {
            username: this.username.toLowerCase(),
            password: this.password
         }
      }).then(
         function(response) {
            controller.loggedInUser = response.data.user;
            console.log(controller.loggedInUser);
            controller.username = null;
            controller.password = null;
            controller.loadPage();
         }, function(error) {
            console.log(error);
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
            controller.getChildren();
            controller.includeRoute = 'partials/welcome.html'
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
            // console.log(response);
            controller.loggedInUser = null;
            controller.child = null;
            controller.includeRoute = ''
         }, function(error) {
            console.log(error);
         }
      )
   };

   // --------------
   // CHORES ROUTES
   // --------------
   this.chore = null;
   this.chores = [];
   this.children = [];
   this.child = null;

   this.showChore = (chore) => {
      controller.changeRoute('showChore');
      this.chore = chore;
      // console.log(chore);
   }

   this.editChore = function(chore) {
      this.includeRoute = `partials/editChore.html`
      this.updatedTask = this.chore.task;
      this.updatedPoints = this.chore.points;
      this.updatedMonday = this.chore.monday.toDo;
      this.updatedTuesday = this.chore.tuesday.toDo;
      this.updatedWednesday = this.chore.wednesday.toDo;
      this.updatedThursday = this.chore.thursday.toDo;
      this.updatedFriday = this.chore.friday.toDo;
      this.updatedSaturday = this.chore.saturday.toDo;
      this.updatedSunday = this.chore.sunday.toDo;
   }

   this.postEditedChore = function(task) {
      this.updatedChore = {
         task: this.updatedTask,
         points: this.updatedPoints,
         monday: {
               toDo: this.updatedMonday || false,
               completed: false
            },
         tuesday: {
               toDo: this.updatedTuesday || false,
               completed: false
            },
         wednesday: {
               toDo: this.updatedWednesday || false,
               completed: false
            },
         thursday: {
               toDo: this.updatedThursday || false,
               completed: false
            },
         friday: {
               toDo: this.updatedFriday || false,
               completed: false
            },
         saturday: {
               toDo: this.updatedSaturday || false,
               completed: false
            },
         sunday: {
               toDo: this.updatedSunday || false,
               completed: false
            },
      }
      this.chores = this.chores.filter(chore => chore.task !== task);
      this.chores.push(this.updatedChore);
      $http({
         method: 'PUT',
         url: '/chores/' + this.child._id,
         data: {
            chores: controller.chores
         }
      }).then(
         (response) => {
            // console.log(response);
            this.updatedChore = null;
            controller.showChild(this.child);
         }
      )
   }

   this.deleteChore = function(task) {
      this.chores = this.chores.filter(chore => chore.task !== task)
      console.log(this.chores);
      $http({
         method: 'PUT',
         url: '/chores/' + this.child._id,
         data: {
            chores: controller.chores
         }
      }).then(
         (response) => {
            console.log(response);
            controller.showChild(this.child);
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
                  monday: {
                        toDo: this.monday || false,
                        completed: false
                     },
                  tuesday: {
                        toDo: this.tuesday || false,
                        completed: false
                     },
                  wednesday: {
                        toDo: this.wednesday || false,
                        completed: false
                     },
                  thursday: {
                        toDo: this.thursday || false,
                        completed: false
                     },
                  friday: {
                        toDo: this.friday || false,
                        completed: false
                     },
                  saturday: {
                        toDo: this.saturday || false,
                        completed: false
                     },
                  sunday: {
                        toDo: this.sunday || false,
                        completed: false
                     },
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
            // console.log(response.data);
            this.children = response.data
            // console.log(this.children);
         })
   };

   this.showChild = function(child) {
      $http({
         method: 'GET',
         url: '/users/child/' + child._id
      }).then((response) => {
         // console.log('clicked');
         // console.log(response.data);
         this.chore = null;
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
