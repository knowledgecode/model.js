/**
 * @preserve model.js v1.1.0 (c) 2013 knowledgecode | MIT licensed
 */
/*global $ */
/*jslint browser: true, nomen: true, plusplus: true */
(function () {
    'use strict';

    var id = 'model',
        f = function (opt_data) {
            var model = {},
                data = typeof opt_data === 'object' ? opt_data : {},
                observers = {},
                validates = {},
                undef,

                /**
                 * @name _notify
                 * @function
                 * @param {String} type
                 * @param {Object} value1
                 * @param {Object} value2
                 */
                _notify = function (type, value1, value2) {
                    var observer = observers[type],
                        i,
                        len,
                        listener,
                        fn = function () {
                            listener.call(listener, value1, value2);
                        };

                    if (observer) {
                        for (i = 0, len = observer.length; i < len; i++) {
                            listener = observer[i];
                            setTimeout(fn, 0);
                        }
                    }
                },

                /**
                 * @name _validate
                 * @function
                 * @param {String} keyName
                 * @param {Object} value
                 * @return {Boolean} validattion
                 */
                _validate = function (keyName, value) {
                    var fn = validates[keyName],
                        msg,
                        ret;

                    if (fn) {
                        msg = fn.call(fn, value);
                        if (msg) {
                            _notify('error@' + keyName, value, msg);
                            ret = false;
                        } else {
                            ret = true;
                        }
                    } else {
                        ret = true;
                    }
                    return ret;
                };

            /**
             * @name get
             * @function
             * @param {String} keyName
             * @return {Object} value
             */
            model.get = function (keyName) {
                return data[keyName];
            };

            /**
             * @name add
             * @function
             * @param {String} keyName
             * @param {Object} value
             * @param {Boolean=} opt_ignore
             */
            model.add = function (keyName, value, opt_ignore) {
                if (typeof keyName !== 'string') {
                    throw 'Unexpected type.';
                }
                if (data.hasOwnProperty(keyName)) {
                    throw 'Already exist.';
                }
                if (_validate(keyName, value)) {
                    data[keyName] = value;
                    if (!opt_ignore) {
                        _notify('change@' + keyName, undef, value);
                        _notify('change', keyName, undef);
                    }
                }
            };

            /**
             * @name update
             * @function
             * @param {String} keyName
             * @param {Object} value
             * @param {Boolean=} opt_ignore
             */
            model.update = function (keyName, value, opt_ignore) {
                var before;

                if (typeof keyName !== 'string') {
                    throw 'Unexpected type.';
                }
                if (!data.hasOwnProperty(keyName)) {
                    throw 'Not defined.';
                }
                before = data[keyName];
                if (_validate(keyName, value)) {
                    data[keyName] = value;
                    if (!opt_ignore) {
                        _notify('change@' + keyName, before, value);
                        _notify('change', keyName, undef);
                    }
                }
            };

            /**
             * @name remove
             * @function
             * @param {String} keyName
             * @param {Boolean=} opt_ignore
             */
            model.remove = function (keyName, opt_ignore) {
                var before;

                if (typeof keyName !== 'string') {
                    throw 'Unexpected type.';
                }
                if (!data.hasOwnProperty(keyName)) {
                    throw 'Not defined.';
                }
                before = data[keyName];
                delete data[keyName];
                if (!opt_ignore) {
                    _notify('change@' + keyName, before, undef);
                    _notify('change', keyName, undef);
                }
            };

            /**
             * @name clear
             * @function
             * @param {Boolean=} opt_ignore
             */
            model.clear = function (opt_ignore) {
                data = {};
                if (!opt_ignore) {
                    _notify('change', '*', undef);
                }
            };

            /**
             * @name validate
             * @function
             * @param {String} keyName
             * @param {Function} fn
             */
            model.validate = function (keyName, fn) {
                if (typeof keyName !== 'string') {
                    throw 'Unexpected type.';
                }
                if (validates.hasOwnProperty(keyName)) {
                    throw 'Already exist.';
                }
                validates[keyName] = fn;
            };

            /**
             * @name removeValidation
             * @function
             * @param {String} keyName
             */
            model.removeValidation = function (keyName) {
                if (typeof keyName !== 'string') {
                    throw 'Unexpected type.';
                }
                if (!validates.hasOwnProperty(keyName)) {
                    throw 'Not defined.';
                }
                delete validates[keyName];
            };

            /**
             * @name clearValidations
             * @function
             */
            model.clearValidations = function () {
                validates = {};
            };

            /**
             * @name on
             * @function
             * @param {String | Object} arg1
             * @param {Function | undefined} arg2
             * @return {Function | Object} arg2
             */
            model.on = function (arg1, arg2) {
                var on = function (type, observer) {
                        if (typeof type !== 'string') {
                            throw 'Unexpected type.';
                        }
                        observers[type] = observers[type] || [];
                        observers[type].push(observer);
                        return observer;
                    },
                    typeName;

                if (typeof arg1 === 'object' && arg2 === undef) {
                    for (typeName in arg1) {
                        if (arg1.hasOwnProperty(typeName)) {
                            on(typeName, arg1[typeName]);
                        }
                    }
                    return arg1;
                }
                return on(arg1, arg2);
            };

            /**
             * @name off
             * @function
             * @param {String | Object} arg1
             * @param {Function | undefined} arg2
             */
            model.off = function (arg1, arg2) {
                var off = function (type, obs) {
                        var observer, i, len;

                        if (typeof type !== 'string') {
                            throw 'Unexpected type.';
                        }
                        observer = observers[type];
                        if (observer) {
                            for (i = 0, len = observer.length; i < len; i++) {
                                if (observer[i] === obs) {
                                    observer.splice(i, 1);
                                    if (observer.length === 0) {
                                        delete observers[type];
                                    }
                                    break;
                                }
                            }
                        }
                    },
                    typeName;

                if (typeof arg1 === 'object' && arg2 === undef) {
                    for (typeName in arg1) {
                        if (arg1.hasOwnProperty(typeName)) {
                            off(typeName, arg1[typeName]);
                        }
                    }
                } else {
                    off(arg1, arg2);
                }
            };

            /**
             * @name clearBindings
             * @function
             */
            model.clearBindings = function () {
                observers = {};
            };

            /**
             * @name exports
             * @function
             * @return data
             */
            model.exports = function () {
                return data;
            };

            return model;
        };

    if (typeof module === 'object' && module.exports) {
        // CommonJS
        module.exports = f;
    } else if ($ && $.fn) {
        // jQuery plugin
        $.fn[id] = f;
    } else {
        // Browser
        window[id] = f;
    }

}());
