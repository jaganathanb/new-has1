define(function() {
    var Exception = function (message, errorObject) {
        this.message = message || '';
        this.errorObject = errorObject || {};
    }

    return  Exception;
});
