/* Fetch angular from the browser scope */
var angular = window.angular;

function inherit(parent, extra) {

    return angular.extend(new (angular.extend(function() {}, {prototype: parent}))(), extra);
}

function inheritPrototype(childObject, parentObject) {

    var copyOfParent = Object.create(parentObject.prototype);

    copyOfParent.constructor = childObject;

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
