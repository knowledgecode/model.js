# Model.js
Model.js is a jQuery plugin. Work in jQuery or other compatible library (ex. jQMobi, Zepto). It also can work standalone.  
"Model" means "M" of client side MVC framework. By using with the [jQuery-View](https://github.com/knowledgecode/jquery-view.js), it has support a Model-View programming in the client side JavaScript.  

## Usage
Add the model.js below the jQuery in your html.  

    <!-- option -->
    <script src="jquery-x.x.x.js"></script>
    <!-- option -->
    <script src="jquery-view.js"></script>

    <script src="model.js"></script>

Then, the "model" function is added in jQuery. When use it without jQuery, "model" function is added in the window object.  

### model([object])
Create the instance. If omitted the argument, Create an empty object.  

    var person = $().model({
            name: 'John Smith',
            age: 20,
            favorite: ['JavaScript', 'Java', 'C#'],
            isMarried: false
        });

### get(keyName)
Get the current value by key name.  

    console.log('My name is ' + person.get('name') + '.');  // My name is John Smith.

### on(type, observer)
### on(observers)
Add an observer. If the latter, be able to add more than one observers at once.  

    /*
    The "type" format is "change" + "@" + property name.
    If the "name" property value is changed, called the callback function.
    The function has two arguments, which are value before and after the change.
    */
    person.on('change@name', function (before, after) {
        console.log('name has changed from ' + before + ' to ' + after);
    });

    /*
    If named just a "change", always call the callback function when changed something in the object.
    In this case, the function has one argument, which is the property name that value is changed.
    */
    person.on('change', function (keyName) {
        console.log(keyName + ' is changed');
    });

    // Be able to add more than one observers at once.
    person.on({
        'change@name': function (before, after) {
            // ...
        },
        'change@age': function (before, after) {
            // ...
        },
        'change@favorite': function (before, after) {
            // ...
        },
        'change@isMarried': function (before, after) {
            // ...
        }
    });

### off(type, observer)
### off(observers)
Remove an observer. If the latter, be able to remove more than one observers at once.  

### clearBindings()
Remove all observers.

### add(keyName, value[, ignore])
Add a property. If registered the observer beforehand, call it.  
If you don't want to called it, the "ignore" option set to true.  

    person.on('change@address', function (before, after) {
        // "before" is undefined
        // "after" is "City of New York"
    });
    person.add('address', 'City of New York');

    // The observer does not call.
    // person.add('address', 'City of Tokyo', true);

### update(keyName, value[, ignore])
Update a property value. If registered the observer beforehand, call it.  
If you don't want to called it, the "ignore" option set to true.  

    person.on('change@age', function (before, after) {
        // "before" is 20
        // "after" is 25
    });
    person.update('age', 25);

### remove(keyName[, ignore])
Remove a property. If registered the observer beforehand, call it.  
If you don't want to be called it, the "ignore" option set to true.  

    person.on('change@age', function (before, after) {
        // "before" is ['JavaScript', 'Java', 'C#']
        // "after" is undefined
    });
    person.remove('favorite');

### clear([ignore])
Remove all properties.  
If registered the "change" observer beforehand, call it.  
If you don't want to be called it, the "ignore" option set to true.  

    person.on('change', function (keyName) {
        // keyName is "*"
    });
    // This observer is not called.
    person.on('change@name', function (before, after) {
        // ...
    });
    person.clear();

### validate(keyName, validator)
Be able to call the validation function immediately before the property value is changed.  

    person.validate('age', function (value) {
        // not an integer
        if (typeof value !== 'number' || Math.floor(value) !== value) {
            return 'invalid value';
        }
        // not in the cards
        if (value < 0 || value > 150 ) {
            return 'out of range';
        }
        // If no problem, return the empty.
        return '';
    });

    /*
    If has errors, called this observer.
    The "type" format is "error" + "@" + property name.
    */
    person.on('error@age', function (value, msg) {
        // errored value
        // error message
    });

    person.update('age', 30);   // ok
    person.update('age', '30'); // invalid value
    person.update('age', 200);  // out of range

### removeValidation(keyName)
Remove a validation function.  

### clearValidations()
Remove all validation functions.  

### exports()
Export the data managed by model.js.  

## License
Model.js is available under the terms of the MIT license.  
