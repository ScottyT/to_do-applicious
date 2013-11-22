var Step = function () {
  this.property('title', 'string', {required: true});
  this.property('description', 'text');
  this.property('status', 'string');

  this.validatesPresent('title');
  this.validatesLength('title', {min: 5});

  this.validatesWithFunction('status', function (status) {
    return status == 'open' || status == 'done';
  }, {message: "Status must be 'open' or 'done.'"});

  this.belongsTo('ToDo');

  /*this.defineProperties({
    title: {type: 'string', required: true},
    description: {type: 'text'},
    status: {type: 'string'}
  });*/

  /*
  this.property('login', 'string', {required: true});
  this.property('password', 'string', {required: true});
  this.property('lastName', 'string');
  this.property('firstName', 'string');

  this.validatesPresent('login');
  this.validatesFormat('login', /[a-z]+/, {message: 'Subdivisions!'});
  this.validatesLength('login', {min: 3});
  // Use with the name of the other parameter to compare with
  this.validatesConfirmed('password', 'confirmPassword');
  // Use with any function that returns a Boolean
  this.validatesWithFunction('password', function (s) {
      return s.length > 0;
  });

  // Can define methods for instances like this
  this.someMethod = function () {
    // Do some stuff
  };
  */

};

/*
// Can also define them on the prototype
Step.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
Step.someStaticMethod = function () {
  // Do some other stuff
};
Step.someStaticProperty = 'YYZ';
*/

Step = geddy.model.register('Step', Step);
