// Generated by CoffeeScript 1.6.2
(function() {
  var Glob, Key,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  exports.Key = Key = (function() {
    function Key(name, optional) {
      this.name = name;
      this.optional = optional;
      this.regex = /[\w\-\s]+/;
      if (this.name === 'controller' || this.name === 'action') {
        this.regex = /[a-zA-Z_][\w\-]*/;
      }
    }

    Key.prototype.regexString = function() {
      var ret;

      ret = String(this.regex).replace(/^\//, '').replace(/\/[gis]?$/, '');
      return "(" + ret + ")" + (this.optional ? '?' : '');
    };

    Key.prototype.test = function(string) {
      return new RegExp("^" + (this.regexString()) + "$").test(string);
    };

    Key.prototype.url = function(string) {
      if (this.test(string)) {
        return string;
      } else {
        return false;
      }
    };

    Key.prototype.where = function(conditions) {
      var condition;

      condition = conditions[this.name];
      if (condition instanceof RegExp) {
        this.regex = condition;
      }
      if (condition instanceof String) {
        this.regex = new RegExp(condition.replace(/^\//, '').replace(/\/[gis]?$/, ''));
      }
      if (condition instanceof Array) {
        this.regex = new RegExp(condition.map(function(cond) {
          return cond.toString().replace(/^\//, '').replace(/\/[gis]?$/, '');
        }).join('|'));
      }
      return this;
    };

    Key.prototype.toString = function() {
      return "key-" + this.name;
    };

    return Key;

  })();

  exports.Glob = Glob = (function(_super) {
    __extends(Glob, _super);

    function Glob(name, optional) {
      this.name = name;
      this.optional = optional;
      this.regex = /[\w\-\/\s]+?/;
      if (this.name === 'controller' || this.name === 'action') {
        this.regex = /[a-zA-Z_][\w\-]*/;
      }
    }

    return Glob;

  })(Key);

}).call(this);
