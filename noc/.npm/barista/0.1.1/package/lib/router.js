// Generated by CoffeeScript 1.6.2
(function() {
  var Resource, Route, Router, qstring;

  Route = require('./route').Route;

  Resource = require('./resource').Resource;

  qstring = require('querystring');

  exports.Router = Router = (function() {
    function Router() {
      this.methods = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
      this.routes = [];
    }

    Router.prototype.match = function(path, method) {
      var route;

      if (typeof method === 'string') {
        method = method.toUpperCase();
      }
      if ((method != null) && !this.methods_regexp().test(method)) {
        throw new Error("method must be one of: " + (this.methods.join(', ')));
      }
      return route = new Route(this, path, method);
    };

    Router.prototype.get = function(path) {
      return this.match(path, 'GET');
    };

    Router.prototype.options = function(path) {
      return this.match(path, 'OPTIONS');
    };

    Router.prototype.put = function(path) {
      return this.match(path, 'PUT');
    };

    Router.prototype.post = function(path) {
      return this.match(path, 'POST');
    };

    Router.prototype.del = function(path) {
      return this.match(path, 'DELETE');
    };

    Router.prototype.resource = function(controller) {
      return new Resource(this, controller);
    };

    Router.prototype.first = function(path, method, cb) {
      var params, route, _i, _len, _ref;

      params = false;
      _ref = this.routes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        route = _ref[_i];
        params = route.parse(path, method);
        if (params) {
          if (typeof cb === 'function') {
            cb(void 0, params);
          }
          return params;
        }
      }
      if (typeof cb === 'function') {
        cb('No matching routes found');
      }
      return false;
    };

    Router.prototype.all = function(path, method) {
      var params, ret, route, _i, _len, _ref;

      ret = [];
      params = false;
      _ref = this.routes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        route = _ref[_i];
        params = route.parse.apply(route, arguments);
        if (params) {
          ret.push(params);
        }
      }
      return ret;
    };

    Router.prototype.url = function(params, add_querystring) {
      var qs, route, url, _i, _len, _ref;

      url = false;
      _ref = this.routes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        route = _ref[_i];
        if ((route.params.controller != null) && route.params.controller !== params.controller) {
          continue;
        }
        if ((route.params.action != null) && route.params.action !== params.action) {
          continue;
        }
        if (url = route.stringify(params)) {
          break;
        }
      }
      if (!url) {
        return false;
      }
      qs = qstring.stringify(url[1]);
      if (add_querystring && qs.length > 0) {
        return url[0] + '?' + qs;
      }
      return url[0];
    };

    Router.prototype.remove = function(name) {
      return this.routes = this.routes.filter(function(el) {
        return el.route_name !== name;
      });
    };

    Router.prototype.defer = function(fn) {
      var route;

      if (typeof fn !== 'function') {
        throw new Error('Router.defer requires a function as the only argument');
      }
      route = new Route(this, 'deferred');
      route.parse = fn;
      delete route.test;
      delete route.stringify;
      this.routes.push(route);
      return route;
    };

    Router.prototype.toString = function() {
      return this.routes.map(function(rt) {
        return rt.toString();
      }).join('\n');
    };

    Router.prototype.methods_regexp = function() {
      return RegExp("^(" + (this.methods.join('|')) + ")$", 'i');
    };

    return Router;

  })();

}).call(this);