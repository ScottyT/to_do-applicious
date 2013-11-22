var Todos = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Todo.all(function(err, todos) {
      self.respondWith(todos, {type:'Todo'});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , todo = geddy.model.Todo.create(params);

    if (!todo.isValid()) {
      this.respondWith(todo);
    }
    else {
      todo.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.respondWith(todo, {status: err});
      });
    }
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Todo.first(params.id, function(err, todo) {
      if (err) {
        throw err;
      }
      if (!todo) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        self.respondWith(todo);
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Todo.first(params.id, function(err, todo) {
      if (err) {
        throw err;
      }
      if (!todo) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        self.respondWith(todo);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Todo.first(params.id, function(err, todo) {
      if (err) {
        throw err;
      }
      todo.updateProperties(params);

      if (!todo.isValid()) {
        self.respondWith(todo);
      }
      else {
        todo.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(todo, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.Todo.first(params.id, function(err, todo) {
      if (err) {
        throw err;
      }
      if (!todo) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        geddy.model.Todo.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(todo);
        });
      }
    });
  };

};

exports.Todos = Todos;
