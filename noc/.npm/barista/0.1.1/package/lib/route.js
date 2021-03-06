// Generated by CoffeeScript 1.6.2
(function() {
  var GLOB, Glob, KEY, Key, OGRP, PARTS, Resource, Route, Text, inflection, kindof, mixin, regExpEscape, _ref,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty;

  _ref = require('./key'), Key = _ref.Key, Glob = _ref.Glob;

  Text = require('./text').Text;

  Resource = require('./resource').Resource;

  inflection = require('inflection');

  KEY = /:([a-zA-Z_][\w\-]*)/;

  GLOB = /\*([a-zA-Z_][\w\-\/]*)/;

  OGRP = /\(([^)]+)\)/;

  PARTS = /\([^)]+\)|:[a-zA-Z_][\w\-]*|\*[a-zA-Z_][\w\-]*|[\w\-_\\\\/\.]+/g;

  exports.Route = Route = (function() {
    function Route(router, path, method) {
      if (router && path) {
        this.match.apply(this, arguments);
      }
    }

    Route.prototype.match = function(router, path, method, optional) {
      var i, key, new_keys, part, prefix, replKey, _i, _j, _len, _len1, _ref1;

      this.optional = optional != null ? optional : false;
      if (typeof path !== 'string') {
        throw new Error('path must be a string');
      }
      if (this.path != null) {
        prefix = this.path;
        new_keys = [];
        if (this.collection || this.member) {
          new_keys.push(':id');
        }
        Array.prototype.push.apply(new_keys, path.match(RegExp(KEY.source, 'g')));
        for (_i = 0, _len = new_keys.length; _i < _len; _i++) {
          key = new_keys[_i];
          replKey = new RegExp(":(" + (key.substring(1)) + "/?)");
          prefix = prefix.replace(replKey, ":" + (inflection.underscore(inflection.singularize(this.params.controller))) + "_$1");
        }
        return new Route(router, prefix + path, method);
      }
      if (typeof method === 'string') {
        this.method = method.toUpperCase();
      }
      this.params = {};
      this.parts = [];
      this.route_name = null;
      this.path = path;
      Object.defineProperty(this, "router", {
        enumerable: false,
        configurable: false,
        writable: false,
        value: router
      });
      while (part = PARTS.exec(path)) {
        this.parts.push(part);
      }
      _ref1 = this.parts;
      for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
        part = _ref1[i];
        if (OGRP.test(part)) {
          this.parts[i] = new Route(this.router, OGRP.exec(part)[1], true, true);
        } else if (KEY.test(part)) {
          this.parts[i] = new Key(KEY.exec(part)[1]);
        } else if (GLOB.test(part)) {
          this.parts[i] = new Glob(GLOB.exec(part)[1]);
        } else {
          this.parts[i] = String(part);
        }
      }
      if (!this.optional) {
        this.router.routes.push(this);
      }
      return this;
    };

    Route.prototype.get = function(path) {
      return this.match(this.router, path, 'GET');
    };

    Route.prototype.put = function(path) {
      return this.match(this.router, path, 'PUT');
    };

    Route.prototype.post = function(path) {
      return this.match(this.router, path, 'POST');
    };

    Route.prototype.del = function(path) {
      return this.match(this.router, path, 'DELETE');
    };

    Route.prototype.resource = function(controller) {
      return new Resource(this, controller);
    };

    Route.prototype.regexString = function() {
      var part, ret, _i, _len, _ref1;

      ret = '';
      _ref1 = this.parts;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        part = _ref1[_i];
        ret += part.regexString ? part.regexString() : regExpEscape(part);
      }
      return "(" + ret + ")" + (this.optional ? '?' : '');
    };

    Route.prototype.test = function(string) {
      if (!this.regex) {
        this.regex = RegExp("^" + (this.regexString()) + "(\\\?.*)?$");
      }
      return this.regex.test(string);
    };

    Route.prototype.to = function(endpoint, extra_params) {
      if (!extra_params && typeof endpoint !== 'string') {
        extra_params = endpoint;
        endpoint = void 0;
      }
      if (endpoint) {
        endpoint = endpoint.split('.');
        if (kindof(endpoint) === 'array' && endpoint.length !== 2) {
          throw new Error('syntax should be in the form: controller.action');
        }
        this.params.controller = endpoint[0];
        this.params.action = endpoint[1];
      }
      if (kindof(extra_params) !== 'object') {
        extra_params = {};
      }
      mixin(this.params, extra_params);
      return this;
    };

    Route.prototype.name = function(name) {
      this.route_name = name;
      return this;
    };

    Route.prototype.where = function(conditions) {
      var part, _i, _len, _ref1;

      if (kindof(conditions) !== 'object') {
        throw new Error('conditions must be an object');
      }
      _ref1 = this.parts;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        part = _ref1[_i];
        if (typeof part !== 'string') {
          part.where(conditions);
        }
      }
      return this;
    };

    Route.prototype.stringify = function(params) {
      var i, key, part, url, val, _i, _j, _len, _ref1, _ref2;

      url = [];
      _ref1 = this.parts;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        part = _ref1[_i];
        if (part instanceof Key || part instanceof Glob) {
          if ((params[part.name] != null) && part.regex.test(params[part.name])) {
            url.push(part.url(params[part.name]));
            delete params[part.name];
          } else if (this.optional) {
            return false;
          }
        } else if (part instanceof Route) {
          url.push(part);
        } else {
          url.push(part);
        }
      }
      for (i = _j = url.length - 1; _j >= 0; i = _j += -1) {
        part = url[i];
        if (part instanceof Route) {
          part = part.stringify(params);
          if (part) {
            params = part[1];
            url[i] = part = part[0];
          } else {
            delete url[i];
          }
        }
      }
      _ref2 = this.params;
      for (key in _ref2) {
        val = _ref2[key];
        delete params[key];
      }
      return [url.join(''), params];
    };

    Route.prototype.keysAndRoutes = function() {
      return this.parts.filter(function(part) {
        return part instanceof Key || part instanceof Glob || part instanceof Route;
      });
    };

    Route.prototype.keys = function() {
      return this.parts.filter(function(part) {
        return part instanceof Key || part instanceof Glob;
      });
    };

    Route.prototype.parse = function(urlParam, method) {
      var head, keysAndRoutes, pair, pairings, params, part, parts, path, segm, url, _i, _ref1;

      url = require('url').parse(urlParam);
      path = decodeURI(url.pathname);
      params = {
        method: method
      };
      mixin(params, this.params);
      head = params.method === 'HEAD';
      if (head) {
        params.method = 'GET';
      }
      if ((this.method != null) && (params.method != null)) {
        if (this.method !== params.method) {
          return false;
        }
      }
      if ((_ref1 = params.method) == null) {
        params.method = this.method;
      }
      if (!this.test(path)) {
        return false;
      }
      parts = new RegExp("^" + (this.regexString()) + "$").exec(path).slice(2);
      keysAndRoutes = this.keysAndRoutes();
      pairings = [];
      
    for (var i=0, j=0; i<keysAndRoutes.length; i++, j++) {
      var part = parts[j]
        , segm = keysAndRoutes[i]

      // if this part doesnt match the segment, move on
      if ( !segm.test(part) ) { j++; continue }

      // stash the pairings for loop 2
      pairings.push( [ segm, part ] )

      // routes must advance the part iterator by the number of parts matched in the segment
      if (segm instanceof Route) j+= part.match(segm.regexString()).slice(2).length || 0
    }
    ;
      for (_i = pairings.length - 1; _i >= 0; _i += -1) {
        pair = pairings[_i];
        part = pair[1];
        segm = pair[0];
        if (segm instanceof Key || segm instanceof Glob) {
          params[segm.name] = part;
        } else if (segm instanceof Route) {
          mixin(params, segm.parse(part, method));
        }
      }
      if (head) {
        params.method = 'HEAD';
      }
      return params;
    };

    Route.prototype.nest = function(cb) {
      if (typeof cb !== 'function') {
        throw new Error('route.nest() requires a callback function');
      }
      cb.call(this);
      return this;
    };

    Route.prototype.toString = function() {
      var rpad;

      rpad = function(str, len) {
        var ret;

        ret = new Array(len + 1);
        ret.splice(0, str.length, str);
        return ret.join(' ');
      };
      return [rpad(this.method || 'ALL', 8), rpad(this.path, 50), [this.params.controller, this.params.action].join('.')].join('');
    };

    return Route;

  })();

  mixin = function() {
    var key, mixins, obj, ret, val, _i, _len;

    ret = arguments[0], mixins = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = mixins.length; _i < _len; _i++) {
      obj = mixins[_i];
      for (key in obj) {
        if (!__hasProp.call(obj, key)) continue;
        val = obj[key];
        if (kindof(val) === 'object') {
          ret[key] = mixin({}, val);
        } else {
          ret[key] = val;
        }
      }
    }
    return ret;
  };

  kindof = function(o) {
    switch (false) {
      case typeof o === "object":
        return typeof o;
      case o !== null:
        return "null";
      case o.constructor !== Array:
        return "array";
      case o.constructor !== Date:
        return "date";
      case o.constructor !== RegExp:
        return "regex";
      default:
        return "object";
    }
  };

  regExpEscape = (function() {
    var sRE, specials;

    specials = ['/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\'];
    sRE = new RegExp("(\\" + (specials.join('|\\')) + ")", 'g');
    return function(text) {
      return text.replace(sRE, '\\$1');
    };
  })();

}).call(this);
