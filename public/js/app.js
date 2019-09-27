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
            name: this.createName,
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

   this.deleteChild = function(child) {
      $http({
         method: 'DELETE',
         url: '/users/child/' + child._id
      }).then(
         (response) => {
            controller.loadPage();
         }
      )
   }

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
            // console.log(controller.loggedInUser);
            controller.username = null;
            controller.password = null;
            this.chores = controller.loggedInUser.chores || null;
            // console.log(this.chores);
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
   this.extraPointsChores = [];
   this.children = [];
   this.child = null;
   this.points = null;
   this.type = null;

   this.showChore = (chore) => {
      controller.changeRoute('showChore');
      this.chore = chore;
      // console.log(this.includeRoute);
      // console.log(this.chore);
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
                  createdBy: this.loggedInUser._id
               }
      }).then((response) => {
         controller.resetChoreForm();
         controller.showChild(this.child);
      })
   }

   this.resetChoreForm = function() {
      this.task = null;
      this.points = null;
      this.monday = null;
      this.tuesday = null;
      this.wednesday = null;
      this.thursday = null;
      this.friday = null;
      this.saturday = null;
      this.sunday = null;
   }

   // ---------------------------
   //  EXTRA POINT CHORES ROUTES
   // ---------------------------
   this.showBonusPoints = function(type) {
      this.type = type;
      controller.includeRoute = 'partials/showBonusPoints.html'
      $http({
         method: 'GET',
         url: '/extrapoints'
      }).then((response) => {
         this.extraPointsChores = response.data;
         // console.log(this.extraPointsChores);
         // controller.includeRoute = 'partials/addPoints.html'
      })
   }

   this.addExtraPointsChore = function() {
      $http({
         method: 'POST',
         url: '/extrapoints',
         data: {
            task: this.bonusTask,
            points: this.bonusPoints,
            createdBy: controller.loggedInUser._id
         }
      }).then(
         (response) => {
            this.bonusTask = null;
            this.bonusPoints = null;
            controller.showBonusPoints()
         }
      )
   }

   this.updateExtraPointsForm = function(chore) {
      this.type = null;
      this.chore = chore;
      this.includeRoute = `partials/updateExtraPointsChore.html`
      this.bonusTask = this.chore.task;
      this.bonusPoints = this.chore.points;
   };

   this.updateRemovePointsForm = function(chore) {
      this.type = 'remove';
      this.chore = chore;
      this.includeRoute = `partials/updateExtraPointsChore.html`
      this.bonusTask = this.chore.task;
      this.bonusPoints = this.chore.points;
   };

   this.updateExtraPointsChore = function(chore) {
      $http({
         method: 'PUT',
         url: '/extrapoints/' + chore._id,
         data: {
            task: this.bonusTask,
            points: this.bonusPoints,
            createdBy: controller.loggedInUser._id
         }
      }).then(
         (response) => {
            this.bonusTask = null;
            this.bonusPoints = null;
            this.chore = null;
            controller.showBonusPoints(this.type)
         }
      )
   }

   this.deleteExtraPointsChore = function(id) {
      $http({
         method: 'DELETE',
         url: '/extrapoints/' + id
      }).then(
         (response) => {
            // console.log(response);
            controller.showBonusPoints();
         }
      )
   }

   this.showAddExtraPoints = function(type) {
      // console.log(this.child);
      this.type = type;
      controller.includeRoute = 'partials/addExtraPoints.html'
      $http({
         method: 'GET',
         url: '/extrapoints'
      }).then((response) => {
         this.extraPointsChores = response.data;
      })
   }

   this.addBonusChore = function(type) {
      this.type = type;
      controller.includeRoute = 'partials/addExtraPointsChore.html'
   };

   this.addExtraPoints = function(points) {
      // console.log('clicked');
      this.points = this.child.points += points;
      // console.log('new point total is: ', this.points);
      $http({
         method: 'PUT',
         url: '/chores/update/' + this.child._id,
         data: {
            points: this.points
         }
      }).then(
         (response) => {
            this.points = null;
            controller.showChild(this.child);
         }
      )

   }

   // ----------------------
   //  CHILD ACCOUNT ROUTES
   // ----------------------
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

   this.childShowChore = (chore) => {
      controller.changeRoute('childShowChore');
      this.chore = chore;
   };

   this.markCompleted = function(day) {

   }

   this.temporaryMarkCompleted = function(day) {
      switch(day) {
         case 'monday':
            this.updatedChore = {
               task: this.chore.task,
               points: this.chore.points,
               monday: {
                     toDo: this.chore.monday.toDo,
                     completed: true
                  },
               tuesday: {
                     toDo: this.chore.tuesday.toDo,
                     completed: this.chore.tuesday.completed
                  },
               wednesday: {
                     toDo: this.chore.wednesday.toDo,
                     completed: this.chore.wednesday.completed
                  },
               thursday: {
                     toDo: this.chore.thursday.toDo,
                     completed: this.chore.thursday.completed
                  },
               friday: {
                     toDo: this.chore.friday.toDo,
                     completed: this.chore.friday.completed
                  },
               saturday: {
                     toDo: this.chore.saturday.toDo,
                     completed: this.chore.saturday.completed
                  },
               sunday: {
                     toDo: this.chore.sunday.toDo,
                     completed: this.chore.sunday.completed
                  }
            };
         break;
         case 'tuesday':
            this.updatedChore = {
               task: this.chore.task,
               points: this.chore.points,
               monday: {
                     toDo: this.chore.monday.toDo,
                     completed: this.chore.monday.completed
                  },
               tuesday: {
                     toDo: this.chore.tuesday.toDo,
                     completed: true
                  },
               wednesday: {
                     toDo: this.chore.wednesday.toDo,
                     completed: this.chore.wednesday.completed
                  },
               thursday: {
                     toDo: this.chore.thursday.toDo,
                     completed: this.chore.thursday.completed
                  },
               friday: {
                     toDo: this.chore.friday.toDo,
                     completed: this.chore.friday.completed
                  },
               saturday: {
                     toDo: this.chore.saturday.toDo,
                     completed: this.chore.saturday.completed
                  },
               sunday: {
                     toDo: this.chore.sunday.toDo,
                     completed: this.chore.sunday.completed
                  }
            };
         break;
         case 'wednesday':
            this.updatedChore = {
               task: this.chore.task,
               points: this.chore.points,
               monday: {
                     toDo: this.chore.monday.toDo,
                     completed: this.chore.monday.completed
                  },
               tuesday: {
                     toDo: this.chore.tuesday.toDo,
                     completed: this.chore.tuesday.completed
                  },
               wednesday: {
                     toDo: this.chore.wednesday.toDo,
                     completed: true
                  },
               thursday: {
                     toDo: this.chore.thursday.toDo,
                     completed: this.chore.thursday.completed
                  },
               friday: {
                     toDo: this.chore.friday.toDo,
                     completed: this.chore.friday.completed
                  },
               saturday: {
                     toDo: this.chore.saturday.toDo,
                     completed: this.chore.saturday.completed
                  },
               sunday: {
                     toDo: this.chore.sunday.toDo,
                     completed: this.chore.sunday.completed
                  }
            };
         break;
         case 'thursday':
            this.updatedChore = {
               task: this.chore.task,
               points: this.chore.points,
               monday: {
                     toDo: this.chore.monday.toDo,
                     completed: this.chore.monday.completed
                  },
               tuesday: {
                     toDo: this.chore.tuesday.toDo,
                     completed: this.chore.tuesday.completed
                  },
               wednesday: {
                     toDo: this.chore.wednesday.toDo,
                     completed: this.chore.wednesday.completed
                  },
               thursday: {
                     toDo: this.chore.thursday.toDo,
                     completed: true
                  },
               friday: {
                     toDo: this.chore.friday.toDo,
                     completed: this.chore.friday.completed
                  },
               saturday: {
                     toDo: this.chore.saturday.toDo,
                     completed: this.chore.saturday.completed
                  },
               sunday: {
                     toDo: this.chore.sunday.toDo,
                     completed: this.chore.sunday.completed
                  }
            };
         break;
         case 'friday':
            this.updatedChore = {
               task: this.chore.task,
               points: this.chore.points,
               monday: {
                     toDo: this.chore.monday.toDo,
                     completed: this.chore.monday.completed
                  },
               tuesday: {
                     toDo: this.chore.tuesday.toDo,
                     completed: this.chore.tuesday.completed
                  },
               wednesday: {
                     toDo: this.chore.wednesday.toDo,
                     completed: this.chore.wednesday.completed
                  },
               thursday: {
                     toDo: this.chore.thursday.toDo,
                     completed: this.chore.thursday.completed
                  },
               friday: {
                     toDo: this.chore.friday.toDo,
                     completed: true
                  },
               saturday: {
                     toDo: this.chore.saturday.toDo,
                     completed: this.chore.saturday.completed
                  },
               sunday: {
                     toDo: this.chore.sunday.toDo,
                     completed: this.chore.sunday.completed
                  }
            };
         break;
         case 'saturday':
            this.updatedChore = {
               task: this.chore.task,
               points: this.chore.points,
               monday: {
                     toDo: this.chore.monday.toDo,
                     completed: this.chore.monday.completed
                  },
               tuesday: {
                     toDo: this.chore.tuesday.toDo,
                     completed: this.chore.tuesday.completed
                  },
               wednesday: {
                     toDo: this.chore.wednesday.toDo,
                     completed: this.chore.wednesday.completed
                  },
               thursday: {
                     toDo: this.chore.thursday.toDo,
                     completed: this.chore.thursday.completed
                  },
               friday: {
                     toDo: this.chore.friday.toDo,
                     completed: this.chore.friday.completed
                  },
               saturday: {
                     toDo: this.chore.saturday.toDo,
                     completed: true
                  },
               sunday: {
                     toDo: this.chore.sunday.toDo,
                     completed: this.chore.sunday.completed
                  }
            };
         break;
         case 'sunday':
            this.updatedChore = {
               task: this.chore.task,
               points: this.chore.points,
               monday: {
                     toDo: this.chore.monday.toDo,
                     completed: this.chore.monday.completed
                  },
               tuesday: {
                     toDo: this.chore.tuesday.toDo,
                     completed: this.chore.tuesday.completed
                  },
               wednesday: {
                     toDo: this.chore.wednesday.toDo,
                     completed: this.chore.wednesday.completed
                  },
               thursday: {
                     toDo: this.chore.thursday.toDo,
                     completed: this.chore.thursday.completed
                  },
               friday: {
                     toDo: this.chore.friday.toDo,
                     completed: this.chore.friday.completed
                  },
               saturday: {
                     toDo: this.chore.saturday.toDo,
                     completed: this.chore.saturday.completed
                  },
               sunday: {
                     toDo: this.chore.sunday.toDo,
                     completed: true
                  }
            };
         break;
      }
      this.loggedInUser.chores = this.loggedInUser.chores.filter(chore => chore.task !== this.chore.task);
      this.loggedInUser.chores.push(this.updatedChore);
      $http({
         method: 'PUT',
         url: '/chores/update/' + this.loggedInUser._id,
         data: {
            chores: controller.loggedInUser.chores
         }
      }).then(
         (response) => {
            // console.log(response.data);
            // console.log(response.data.chores[0].monday.completed);
            controller.loggedInUser.chores = response.data.chores;
            // console.log(this.loggedInUser.chores);
            this.updatedChore = null;
            controller.loadPage();
         }
      )
   }

   this.parentMarkedCompleted = function(day) {
      switch(day) {
         case 'monday':
            this.updatedChore = {
               task: this.chore.task,
               points: this.chore.points,
               monday: {
                     toDo: this.chore.monday.toDo,
                     completed: false
                  },
               tuesday: {
                     toDo: this.chore.tuesday.toDo,
                     completed: this.chore.tuesday.completed
                  },
               wednesday: {
                     toDo: this.chore.wednesday.toDo,
                     completed: this.chore.wednesday.completed
                  },
               thursday: {
                     toDo: this.chore.thursday.toDo,
                     completed: this.chore.thursday.completed
                  },
               friday: {
                     toDo: this.chore.friday.toDo,
                     completed: this.chore.friday.completed
                  },
               saturday: {
                     toDo: this.chore.saturday.toDo,
                     completed: this.chore.saturday.completed
                  },
               sunday: {
                     toDo: this.chore.sunday.toDo,
                     completed: this.chore.sunday.completed
                  }
            };
         break;
         case 'tuesday':
            this.updatedChore = {
               task: this.chore.task,
               points: this.chore.points,
               monday: {
                     toDo: this.chore.monday.toDo,
                     completed: this.chore.monday.completed
                  },
               tuesday: {
                     toDo: this.chore.tuesday.toDo,
                     completed: false
                  },
               wednesday: {
                     toDo: this.chore.wednesday.toDo,
                     completed: this.chore.wednesday.completed
                  },
               thursday: {
                     toDo: this.chore.thursday.toDo,
                     completed: this.chore.thursday.completed
                  },
               friday: {
                     toDo: this.chore.friday.toDo,
                     completed: this.chore.friday.completed
                  },
               saturday: {
                     toDo: this.chore.saturday.toDo,
                     completed: this.chore.saturday.completed
                  },
               sunday: {
                     toDo: this.chore.sunday.toDo,
                     completed: this.chore.sunday.completed
                  }
            };
         break;
         case 'wednesday':
            this.updatedChore = {
               task: this.chore.task,
               points: this.chore.points,
               monday: {
                     toDo: this.chore.monday.toDo,
                     completed: this.chore.monday.completed
                  },
               tuesday: {
                     toDo: this.chore.tuesday.toDo,
                     completed: this.chore.tuesday.completed
                  },
               wednesday: {
                     toDo: this.chore.wednesday.toDo,
                     completed: false
                  },
               thursday: {
                     toDo: this.chore.thursday.toDo,
                     completed: this.chore.thursday.completed
                  },
               friday: {
                     toDo: this.chore.friday.toDo,
                     completed: this.chore.friday.completed
                  },
               saturday: {
                     toDo: this.chore.saturday.toDo,
                     completed: this.chore.saturday.completed
                  },
               sunday: {
                     toDo: this.chore.sunday.toDo,
                     completed: this.chore.sunday.completed
                  }
            };
         break;
         case 'thursday':
            this.updatedChore = {
               task: this.chore.task,
               points: this.chore.points,
               monday: {
                     toDo: this.chore.monday.toDo,
                     completed: this.chore.monday.completed
                  },
               tuesday: {
                     toDo: this.chore.tuesday.toDo,
                     completed: this.chore.tuesday.completed
                  },
               wednesday: {
                     toDo: this.chore.wednesday.toDo,
                     completed: this.chore.wednesday.completed
                  },
               thursday: {
                     toDo: this.chore.thursday.toDo,
                     completed: false
                  },
               friday: {
                     toDo: this.chore.friday.toDo,
                     completed: this.chore.friday.completed
                  },
               saturday: {
                     toDo: this.chore.saturday.toDo,
                     completed: this.chore.saturday.completed
                  },
               sunday: {
                     toDo: this.chore.sunday.toDo,
                     completed: this.chore.sunday.completed
                  }
            };
         break;
         case 'friday':
            this.updatedChore = {
               task: this.chore.task,
               points: this.chore.points,
               monday: {
                     toDo: this.chore.monday.toDo,
                     completed: this.chore.monday.completed
                  },
               tuesday: {
                     toDo: this.chore.tuesday.toDo,
                     completed: this.chore.tuesday.completed
                  },
               wednesday: {
                     toDo: this.chore.wednesday.toDo,
                     completed: this.chore.wednesday.completed
                  },
               thursday: {
                     toDo: this.chore.thursday.toDo,
                     completed: this.chore.thursday.completed
                  },
               friday: {
                     toDo: this.chore.friday.toDo,
                     completed: false
                  },
               saturday: {
                     toDo: this.chore.saturday.toDo,
                     completed: this.chore.saturday.completed
                  },
               sunday: {
                     toDo: this.chore.sunday.toDo,
                     completed: this.chore.sunday.completed
                  }
            };
         break;
         case 'saturday':
            this.updatedChore = {
               task: this.chore.task,
               points: this.chore.points,
               monday: {
                     toDo: this.chore.monday.toDo,
                     completed: this.chore.monday.completed
                  },
               tuesday: {
                     toDo: this.chore.tuesday.toDo,
                     completed: this.chore.tuesday.completed
                  },
               wednesday: {
                     toDo: this.chore.wednesday.toDo,
                     completed: this.chore.wednesday.completed
                  },
               thursday: {
                     toDo: this.chore.thursday.toDo,
                     completed: this.chore.thursday.completed
                  },
               friday: {
                     toDo: this.chore.friday.toDo,
                     completed: this.chore.friday.completed
                  },
               saturday: {
                     toDo: this.chore.saturday.toDo,
                     completed: false
                  },
               sunday: {
                     toDo: this.chore.sunday.toDo,
                     completed: this.chore.sunday.completed
                  }
            };
         break;
         case 'sunday':
            this.updatedChore = {
               task: this.chore.task,
               points: this.chore.points,
               monday: {
                     toDo: this.chore.monday.toDo,
                     completed: this.chore.monday.completed
                  },
               tuesday: {
                     toDo: this.chore.tuesday.toDo,
                     completed: this.chore.tuesday.completed
                  },
               wednesday: {
                     toDo: this.chore.wednesday.toDo,
                     completed: this.chore.wednesday.completed
                  },
               thursday: {
                     toDo: this.chore.thursday.toDo,
                     completed: this.chore.thursday.completed
                  },
               friday: {
                     toDo: this.chore.friday.toDo,
                     completed: this.chore.friday.completed
                  },
               saturday: {
                     toDo: this.chore.saturday.toDo,
                     completed: this.chore.saturday.completed
                  },
               sunday: {
                     toDo: this.chore.sunday.toDo,
                     completed: false
                  }
            };
         break;
      }
      this.chores = this.chores.filter(chore => chore.task !== this.chore.task);
      this.chores.push(this.updatedChore);
      this.points = this.child.points += this.chore.points;
      $http({
         method: 'PUT',
         url: '/chores/update/' + this.child._id,
         data: {
            points: controller.points,
            chores: controller.chores
         }
      }).then(
         (response) => {
            this.points = null;
            this.updatedChore = null;
            controller.showChild(this.child);
            // controller.loadPage();
         }
      )
   };

   this.parentMarkedRedo = function(day) {
      switch(day) {
         case 'monday':
            this.updatedChore = {
               task: this.chore.task,
               points: this.chore.points,
               monday: {
                     toDo: this.chore.monday.toDo,
                     completed: false
                  },
               tuesday: {
                     toDo: this.chore.tuesday.toDo,
                     completed: this.chore.tuesday.completed
                  },
               wednesday: {
                     toDo: this.chore.wednesday.toDo,
                     completed: this.chore.wednesday.completed
                  },
               thursday: {
                     toDo: this.chore.thursday.toDo,
                     completed: this.chore.thursday.completed
                  },
               friday: {
                     toDo: this.chore.friday.toDo,
                     completed: this.chore.friday.completed
                  },
               saturday: {
                     toDo: this.chore.saturday.toDo,
                     completed: this.chore.saturday.completed
                  },
               sunday: {
                     toDo: this.chore.sunday.toDo,
                     completed: this.chore.sunday.completed
                  }
            };
         break;
         case 'tuesday':
            this.updatedChore = {
               task: this.chore.task,
               points: this.chore.points,
               monday: {
                     toDo: this.chore.monday.toDo,
                     completed: this.chore.monday.completed
                  },
               tuesday: {
                     toDo: this.chore.tuesday.toDo,
                     completed: false
                  },
               wednesday: {
                     toDo: this.chore.wednesday.toDo,
                     completed: this.chore.wednesday.completed
                  },
               thursday: {
                     toDo: this.chore.thursday.toDo,
                     completed: this.chore.thursday.completed
                  },
               friday: {
                     toDo: this.chore.friday.toDo,
                     completed: this.chore.friday.completed
                  },
               saturday: {
                     toDo: this.chore.saturday.toDo,
                     completed: this.chore.saturday.completed
                  },
               sunday: {
                     toDo: this.chore.sunday.toDo,
                     completed: this.chore.sunday.completed
                  }
            };
         break;
         case 'wednesday':
            this.updatedChore = {
               task: this.chore.task,
               points: this.chore.points,
               monday: {
                     toDo: this.chore.monday.toDo,
                     completed: this.chore.monday.completed
                  },
               tuesday: {
                     toDo: this.chore.tuesday.toDo,
                     completed: this.chore.tuesday.completed
                  },
               wednesday: {
                     toDo: this.chore.wednesday.toDo,
                     completed: false
                  },
               thursday: {
                     toDo: this.chore.thursday.toDo,
                     completed: this.chore.thursday.completed
                  },
               friday: {
                     toDo: this.chore.friday.toDo,
                     completed: this.chore.friday.completed
                  },
               saturday: {
                     toDo: this.chore.saturday.toDo,
                     completed: this.chore.saturday.completed
                  },
               sunday: {
                     toDo: this.chore.sunday.toDo,
                     completed: this.chore.sunday.completed
                  }
            };
         break;
         case 'thursday':
            this.updatedChore = {
               task: this.chore.task,
               points: this.chore.points,
               monday: {
                     toDo: this.chore.monday.toDo,
                     completed: this.chore.monday.completed
                  },
               tuesday: {
                     toDo: this.chore.tuesday.toDo,
                     completed: this.chore.tuesday.completed
                  },
               wednesday: {
                     toDo: this.chore.wednesday.toDo,
                     completed: this.chore.wednesday.completed
                  },
               thursday: {
                     toDo: this.chore.thursday.toDo,
                     completed: false
                  },
               friday: {
                     toDo: this.chore.friday.toDo,
                     completed: this.chore.friday.completed
                  },
               saturday: {
                     toDo: this.chore.saturday.toDo,
                     completed: this.chore.saturday.completed
                  },
               sunday: {
                     toDo: this.chore.sunday.toDo,
                     completed: this.chore.sunday.completed
                  }
            };
         break;
         case 'friday':
            this.updatedChore = {
               task: this.chore.task,
               points: this.chore.points,
               monday: {
                     toDo: this.chore.monday.toDo,
                     completed: this.chore.monday.completed
                  },
               tuesday: {
                     toDo: this.chore.tuesday.toDo,
                     completed: this.chore.tuesday.completed
                  },
               wednesday: {
                     toDo: this.chore.wednesday.toDo,
                     completed: this.chore.wednesday.completed
                  },
               thursday: {
                     toDo: this.chore.thursday.toDo,
                     completed: this.chore.thursday.completed
                  },
               friday: {
                     toDo: this.chore.friday.toDo,
                     completed: false
                  },
               saturday: {
                     toDo: this.chore.saturday.toDo,
                     completed: this.chore.saturday.completed
                  },
               sunday: {
                     toDo: this.chore.sunday.toDo,
                     completed: this.chore.sunday.completed
                  }
            };
         break;
         case 'saturday':
            this.updatedChore = {
               task: this.chore.task,
               points: this.chore.points,
               monday: {
                     toDo: this.chore.monday.toDo,
                     completed: this.chore.monday.completed
                  },
               tuesday: {
                     toDo: this.chore.tuesday.toDo,
                     completed: this.chore.tuesday.completed
                  },
               wednesday: {
                     toDo: this.chore.wednesday.toDo,
                     completed: this.chore.wednesday.completed
                  },
               thursday: {
                     toDo: this.chore.thursday.toDo,
                     completed: this.chore.thursday.completed
                  },
               friday: {
                     toDo: this.chore.friday.toDo,
                     completed: this.chore.friday.completed
                  },
               saturday: {
                     toDo: this.chore.saturday.toDo,
                     completed: false
                  },
               sunday: {
                     toDo: this.chore.sunday.toDo,
                     completed: this.chore.sunday.completed
                  }
            };
         break;
         case 'sunday':
            this.updatedChore = {
               task: this.chore.task,
               points: this.chore.points,
               monday: {
                     toDo: this.chore.monday.toDo,
                     completed: this.chore.monday.completed
                  },
               tuesday: {
                     toDo: this.chore.tuesday.toDo,
                     completed: this.chore.tuesday.completed
                  },
               wednesday: {
                     toDo: this.chore.wednesday.toDo,
                     completed: this.chore.wednesday.completed
                  },
               thursday: {
                     toDo: this.chore.thursday.toDo,
                     completed: this.chore.thursday.completed
                  },
               friday: {
                     toDo: this.chore.friday.toDo,
                     completed: this.chore.friday.completed
                  },
               saturday: {
                     toDo: this.chore.saturday.toDo,
                     completed: this.chore.saturday.completed
                  },
               sunday: {
                     toDo: this.chore.sunday.toDo,
                     completed: false
                  }
            };
         break;
      }
      this.chores = this.chores.filter(chore => chore.task !== this.chore.task);
      this.chores.push(this.updatedChore);
      $http({
         method: 'PUT',
         url: '/chores/update/' + this.child._id,
         data: {
            chores: controller.chores
         }
      }).then(
         (response) => {
            this.points = null;
            this.updatedChore = null;
            controller.showChild(this.child);
            // controller.loadPage();
         }
      )
   }

   // ---------------
   //  REWARD ROUTES
   // ---------------

   this.showRewards = function() {
      $http({
         method: 'GET',
         url: '/rewards'
      }).then(
         (response) => {
            this.reward = null;
            this.rewards = response.data;
            controller.includeRoute = 'partials/showRewards.html'
         }
      )
   }

   this.createReward = function() {
      // console.log(this.loggedInUser);
      $http({
         method: 'POST',
         url: '/rewards',
         data: {
            reward: this.reward,
            price: this.price,
            createdBy: this.loggedInUser._id
         }
      }).then(
         (response) => {
            controller.resetRewardForm();
            controller.showRewards();
         }
      )
   };

   this.setUpdateReward = function(reward) {
      this.reward = reward
      this.updatedReward = reward.reward;
      this.updatedPrice = reward.price
      console.log(this.reward);
      this.includeRoute = `partials/updateReward.html`
   }

   this.updateReward = function() {
      $http({
         method: 'PUT',
         url: '/rewards/' + this.reward._id,
         data: {
            reward: this.updatedReward,
            price: this.updatedPrice,
         }
      }).then(
         (response) => {
            console.log(response);
            this.reward = null;
            controller.showRewards();
         }
      )
   };

   this.deleteReward = function(reward) {
      $http({
         method: 'DELETE',
         url: '/rewards/' + reward._id
      }).then(
         (response) => {
            console.log(response);
            controller.showRewards();
         }
      )
   };

   this.rewardStore = function() {
      $http({
         method: 'GET',
         url: '/rewards/store'
      }).then(
         (response) => {
            // console.log(response);
            this.rewards = response.data;
            controller.includeRoute = 'partials/rewardStore.html'
         }
      )
   }

   this.buyReward = function(reward) {
      // console.log(reward.reward);
      this.points = this.loggedInUser.points - reward.price
      // console.log('new point total is: ', this.points);
      if (this.loggedInUser.points - reward.price < 0) {
         alert('You don\'t have enough points for this reward yet. \nKeep doing your chores and you\'ll have enough before you know it!')
      } else {
         $http({
            method: 'PUT',
            url: '/chores/buy/' + this.loggedInUser._id,
            data: {
               rewards: reward,
               points: this.points
            }
         }).then(
            (response) => {
               this.loggedInUser = response.data;
               this.points = null;
               this.reward = null;
            }
         )
      }
   }

   this.rewardReceived = function(index) {
      // console.log(index);
      this.child.rewards.splice(index, 1);
      // console.log(this.child.rewards);
      $http({
         method: 'PUT',
         url: '/chores/' + this.child._id,
         data: {
            rewards: this.child.rewards
         }
      }).then(
         (response) => {
            controller.showChild(this.child);
         }
      )
   }

   this.resetRewardForm = function() {
      this.reward = null;
      this.price = null;
   }
   // this.getChildren();

}])
