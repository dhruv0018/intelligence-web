const angular = window.angular;
const OrderObjectBy = angular.module('OrderObjectBy.Filter', []);

const filter = () => {

    return (obj, property, reverse) => {

        let objArray = Object
            .keys(obj)
            .map(key => obj[key])
            .sort((a, b) => (a[property] > b[property] ? 1 : -1));

        return reverse ? objArray.reverse() : objArray;
    };
};

OrderObjectBy.filter('orderObjectBy', filter);

export default OrderObjectBy;
