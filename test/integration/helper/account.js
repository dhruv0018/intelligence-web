
module.exports = function Account() {

    this.signout = function(callback) {
        element(by.css(".role-dropdown button")).click();
        element.all(by.css(".role-dropdown .dropdown-menu footer button")).get(1).click(); // second element
        callback();
    };

};