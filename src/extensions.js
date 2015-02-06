/* Fetch angular from the browser scope */
var angular = window.angular;

function inherit(parent, extra) {

    return angular.extend(new (angular.extend(function() {}, {prototype: parent}))(), extra);
}

function inheritPrototype(childObject, parentObject) {
    // Copy the properties and methods from the parentObject onto the childObject​
    // so the copyOfParent object now has everything the parentObject has ​
    var copyOfParent = Object.create(parentObject.prototype);

    // Then we set the constructor of this new object to point to the childObject.​
    copyOfParent.constructor = childObject;

    // Then we set the childObject prototype to copyOfParent,
    // so that the childObject can in turn inherit everything from copyOfParent (from parentObject)​
    childObject.prototype = copyOfParent;
}

function augment(dst) {

    angular.forEach(arguments, function(obj) {

        if (obj !== dst) {

            angular.forEach(obj, function(value, key) {

                if (angular.isUndefined(dst[key])) dst[key] = value;
            });
        }
    });

    return dst;
}

angular.extend(angular, {
    'inherit': inherit,
    'augment': augment,
    'inheritPrototype': inheritPrototype
});

