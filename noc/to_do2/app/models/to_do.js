var ToDo = function () {

  this.property('title', 'string', {required: true});
  this.property('status', 'string');
  

this.validatesPresent('title');
this.validatesLength('title', {min: 5});

  this.validatesWithFunction('status', function (status) {
    return status == 'open' || status == 'done';
  }, {message: "Status must be 'open' or 'done.'"}); 

  this.hasMany('Steps');


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
ToDo.prototype.someOtherMethod = function () {
  // Do some other stuff
};
// Can also define static methods and properties
ToDo.someStaticMethod = function () {
  // Do some other stuff
};
ToDo.someStaticProperty = 'YYZ';
*/

ToDo = geddy.model.register('ToDo', ToDo);
