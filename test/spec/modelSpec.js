/*global describe, it, expect, $, runs, waitsFor, escape */
describe('model', function () {
    'use strict';

    var person = $().model({
        name: 'John Smith',
        age: 20,
        favorite: ['JavaScript', 'Java', 'C#'],
        isMarried: false
    });

    it('get', function () {
        expect(person.get('name')).toEqual('John Smith');
        expect(person.get('age')).toEqual(20);
        expect(person.get('favorite')).toEqual(['JavaScript', 'Java', 'C#']);
        expect(person.get('isMarried')).toEqual(false);
        expect(person.get('address')).toBeFalsy();
        expect(person.get('Name')).toBeFalsy();
        expect(person.get('favorites')).toBeFalsy();
        expect(person.get()).toBeFalsy();
    });

    it('add', function () {
        var result;

        /*jslint unparam: true */
        person.on({
            'change@address': function (before, after) {
                result = after;
                person.off({ 'change@address': this });
            },
            'change@undefined': function (before, after) {
                result = after;
                person.off({ 'change@undefined': this });
            }
        });

        runs(function () {
            person.add('address', 'City of New York');
        });
        waitsFor(function () {
            return result ? true : false;
        }, 'wait for adding address', 100);
        runs(function () {
            expect(result).toEqual('City of New York');
        });

        runs(function () {
            person.add('undefined');
        });
        waitsFor(function () {
            return !result ? true : false;
        }, 'wait for adding undefined', 100);
        runs(function () {
            expect(result).toBeFalsy();
        });

        expect(function () { person.add('age', 25); }).toThrow();
        expect(person.get('age')).toEqual(20);

        expect(function () { person.add(100, 'one hundred'); }).toThrow();
        expect(person.get(100)).toBeFalsy();

        expect(function () { person.add(true, 'true'); }).toThrow();
        expect(person.get(true)).toBeFalsy();

        expect(function () { person.add([], 'array'); }).toThrow();
        expect(person.get([])).toBeFalsy();

        expect(function () { person.add({}, 'object'); }).toThrow();
        expect(person.get({})).toBeFalsy();
    });

    it('update', function () {
        var result1, result2;

        person.on({
            'change@name': function (before, after) {
                result1 = before;
                result2 = after;
                person.off('change@name', this);
            },
            'change@age': function (before, after) {
                result1 = before;
                result2 = after;
                person.off('change@age', this);
            },
            'change@favorite': function (before, after) {
                result1 = before;
                result2 = after;
                person.off('change@favorite', this);
            },
            'change@isMarried': function (before, after) {
                result1 = before;
                result2 = after;
                person.off('change@isMarried', this);
            }
        });

        runs(function () {
            person.update('name', 'Tom Smith');
        });
        waitsFor(function () {
            return result1 && result2 ? true : false;
        }, 'wait for updating name', 100);
        runs(function () {
            expect(result1).toEqual('John Smith');
            expect(result2).toEqual('Tom Smith');
        });

        runs(function () {
            result1 = undefined;
            result2 = undefined;
            person.update('age', 30);
        });
        waitsFor(function () {
            return result1 && result2 ? true : false;
        }, 'wait for updating age', 100);
        runs(function () {
            expect(result1).toEqual(20);
            expect(result2).toEqual(30);
        });

        runs(function () {
            result1 = undefined;
            result2 = undefined;
            person.update('favorite', ['Python', 'Ruby', 'Perl']);
        });
        waitsFor(function () {
            return result1 && result2 ? true : false;
        }, 'wait for updating favorite', 100);
        runs(function () {
            expect(result1).toEqual(['JavaScript', 'Java', 'C#']);
            expect(result2).toEqual(['Python', 'Ruby', 'Perl']);
        });

        runs(function () {
            result1 = undefined;
            result2 = undefined;
            person.update('isMarried', true);
        });
        waitsFor(function () {
            return result1 !== undefined && result2 !== undefined ?
                    true : false;
        }, 'wait for updating isMarried', 100);
        runs(function () {
            expect(result1).toEqual(false);
            expect(result2).toEqual(true);
        });

        expect(function () { person.update('phone', '000-1234-5678'); }).toThrow();
        expect(person.get('phone')).toBeFalsy();

        expect(function () { person.update(100, 'one hundred'); }).toThrow();
        expect(person.get(100)).toBeFalsy();

        expect(function () { person.update(true, 'true'); }).toThrow();
        expect(person.get(true)).toBeFalsy();

        expect(function () { person.update([], 'array'); }).toThrow();
        expect(person.get([])).toBeFalsy();

        expect(function () { person.update({}, 'object'); }).toThrow();
        expect(person.get({})).toBeFalsy();
    });

    it('remove', function () {
        var address, undef;

        /*jslint unparam: true */
        person.on({
            'change@address': function (before, after) {
                address = before;
                person.off('change@address', this);
            },
            'change@undefined': function (before, after) {
                undef = escape(before);
                person.off('change@undefined', this);
            }
        });

        runs(function () {
            person.remove('address');
        });
        waitsFor(function () {
            return address ? true : false;
        }, 'wait for removing address', 100);
        runs(function () {
            expect(address).toEqual('City of New York');
            expect(person.get('address')).toBeFalsy();
        });

        runs(function () {
            person.remove('undefined');
        });
        waitsFor(function () {
            return undef ? true : false;
        }, 'wait for removing undefined', 100);
        runs(function () {
            expect(undef).toEqual('undefined');
            expect(person.get('undefined')).toBeFalsy();
        });

        expect(function () { person.remove('gender'); }).toThrow();
    });

    it('clear', function () {
        var result;

        /*jslint unparam: true */
        person.on('change', function (before, after) {
            result = before;
            person.off({ 'change': this });
        });

        runs(function () {
            person.clear();
        });
        waitsFor(function () {
            return result ? true : false;
        }, 'wait for clearing', 100);
        runs(function () {
            expect(result).toEqual('*');
            expect(person.get('name')).toBeFalsy();
            expect(person.get('age')).toBeFalsy();
            expect(person.get('favorite')).toBeFalsy();
            expect(person.get('isMarried')).toBeFalsy();
        });
    });

    it('validate', function () {
        var name, message;

        person = $().model();
        person.add('name', 'John Smith');
        person.add('age', 20);
        person.add('favorite', ['JavaScript', 'Java', 'C#']);
        person.add('isMarried', false);

        person.validate('name', function (value) {
            if (typeof value !== 'string') {
                return 'Unexpected type.';
            }
            if (value.length === 0) {
                return 'Unable to empty.';
            }
            return '';
        });
        person.on('error@name', function (value, msg) {
            name = value;
            message = msg;
        });
        runs(function () {
            person.update('name', '');
        });
        waitsFor(function () {
            return name !== undefined ? true : false;
        }, 'wait for validating name', 100);
        runs(function () {
            expect(name).toEqual('');
            expect(message).toEqual('Unable to empty.');
        });

        runs(function () {
            person.update('name', undefined);
        });
        waitsFor(function () {
            return name === undefined ? true : false;
        }, 'wait for validating name', 100);
        runs(function () {
            expect(name).toBeFalsy();
            expect(message).toEqual('Unexpected type.');
        });

        runs(function () {
            name = '';
            message = '';
            person.update('name', 'Jelly');
        });
        waitsFor(function () {
            return name === '' ? true : false;
        }, 'wait for validating name', 100);
        runs(function () {
            expect(name).toEqual('');
            expect(message).toEqual('');
        });
    });

    it('removeValidation', function () {
        person.removeValidation('name');

        runs(function () {
            person.update('name', '');
        });
        waitsFor(function () {
            return person.get('name') === '';
        }, 'wait for validating name', 100);
        runs(function () {
            expect(person.get('name')).toEqual('');
        });

        expect(function () { person.removeValidation('name'); }).toThrow();
        expect(function () { person.removeValidation(0); }).toThrow();
        expect(function () { person.removeValidation(); }).toThrow();
    });

    it('clearValidations', function () {
        var age, message;

        person.validate('age', function (value) {
            if (typeof value !== 'number') {
                return 'Unexpected type.';
            }
            if (value >= 200) {
                return 'Live longer too.';
            }
            return '';
        });
        /*jslint unparam: true */
        person.on({
            'error@age': function (value, msg) {
                age = value;
                message = msg;
                person.off('change@age', this);
            },
            'change@age': function (before, after) {
                age = after;
                person.off('change@age', this);
            }
        });

        runs(function () {
            person.update('age', 200);
        });
        waitsFor(function () {
            return age === 200;
        }, 'wait for validating age', 100);
        runs(function () {
            expect(age).toEqual(200);
            expect(message).toEqual('Live longer too.');
        });

        runs(function () {
            person.clearValidations();
            person.update('age', 300);
        });
        waitsFor(function () {
            return age === 300;
        }, 'wait for updating age', 100);
        runs(function () {
            expect(age).toEqual(300);
        });
    });

    it('on without callback', function () {
        var favorite;

        runs(function () {
            person.on('change', function (keyName) {
                favorite = keyName;
            });
            person.update('age', 40, false);
            person.update('favorite', ['C', 'C++'], false);
        });
        waitsFor(function () {
            return favorite;
        }, 'wait for updating favorite', 100);
        runs(function () {
            expect(person.get('favorite')).toEqual(['C', 'C++']);
        });

        runs(function () {
            person.update('favorite', ['Scala', 'Groovy'], true);
        });
        waitsFor(function () {
            return true;
        }, 'wait for updating favorite', 100);
        runs(function () {
            expect(person.get('favorite')).toEqual(['Scala', 'Groovy']);
        });
    });

    it('clearBindings', function () {
        var isMarried;

        runs(function () {
            /*jslint unparam: true */
            person.on('change@isMarried', function (before, after) {
                isMarried = after;
            });
            person.clearBindings();
            person.update('isMarried', true);
        });
        waitsFor(function () {
            return !isMarried;
        }, 'wait for updating favorite', 100);
        runs(function () {
            expect(person.get('isMarried')).toBe(true);
        });
    });

    it('exports', function () {
        var data = person.exports();

        expect(data.name).toEqual(person.get('name'));
        expect(data.age).toEqual(person.get('age'));
        expect(data.favorite).toEqual(person.get('favorite'));
        expect(data.isMarried).toEqual(person.get('isMarried'));
    });

});
