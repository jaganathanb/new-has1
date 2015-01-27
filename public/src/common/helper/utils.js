define(function () {
    var utils = {
        /**
            String utility methods
        */
        string: {
            /**
                Capitalizes a string
                @param {string} value The string value to capitalize
            */
            capitalize: function (value) {
                return value.charAt(0).toUpperCase() + value.slice(1);
            },

            /**
                Returns true if the value is null or an empty string, otherwise returns false
                @param {string} string The string value to test
                @return {boolean} true if value is null or an empty string, otherwise false
            */
            isNullOrEmpty: function (value) {
                return value === null || value === '';
            },

            /**
                Returns true if the string starts with the supplied value
                @param {string} string The string to test
                @param {string} value The value to look for at the start of the string
            */
            startsWith: function (string, value) {
                return string.slice(0, value.length) === value;
            },

            /**
                Returns true if the string ends with the supplied value
                @param {string} string The string to test
                @param {string} value The value to look for at the end of the string
            */
            endsWith: function (string, value) {
                return string.slice(string.length - value.length) === value;
            },

            /**
                Returns true if the string contains the specified value, otherwise false
                @param {string} string The string to test
                @param {string} value The value to look for in the string
            */
            contains: function (string, value) {
                return string.indexOf(value) > -1;
            },

            trimSlashes: function (path) {
                return path.replace(/^\/+|\/+$/g, '');
            }
        },

        /**
            Array utility methods
        */
        array: {
            /**
                Simple compare function for array sorting
                @param {string} propertyName the name of the property you want to sort on
            */
            SortComparer: function (propertyName) {
                return function (a, b) {
                    var p1 = a[propertyName];
                    var p2 = b[propertyName];

                    if (typeof p1 === 'string' || typeof p2 === 'string') {
                        var l1 = p1 ? p1.toLowerCase() : '';
                        var l2 = p2 ? p2.toLowerCase() : '';

                        if (l1 < l2) {
                            return -1;
                        } else if (l1 > l2) {
                            return 1;
                        } else {
                            return 0;
                        }
                    } else {
                        return p1 - p2;
                    }
                };
            },

            /**
                returns the index of the first element that satisfies the predicate condition
                @param {array} the array to search
                @param {function} predicate The predicate function to test against each element
            */
            firstIndexWhere: function (array, predicate) {
                if (typeof predicate !== 'function') {
                    throw new Error('predicate must be a function');
                }

                if (predicate.length !== 1) {
                    throw new Error('expected exactly one predicate argument');
                }

                for (var i = 0; i < array.length; i++) {
                    if (predicate(array[i])) {
                        return i;
                    }
                }

                return null;
            },

            /**
                returns the first element that satisfies the predicate condition
                if no elements satisfy the predicate condition returns null
                @param {array} the array to search
                @param {function} predicate The predicate function to test against each element
            */
            firstOrDefault: function (array, predicate) {

                if (typeof predicate !== 'function') {
                    throw new Error('predicate must be a function');
                }

                if (predicate.length !== 1) {
                    throw new Error('expected exactly one predicate argument');
                }

                for (var i = 0; i < array.length; i++) {
                    if (predicate(array[i])) {
                        return array[i];
                    }
                }

                return null;
            },
            
            /**
                returns an array of elements that satisfy the predicate condition
                if no elements satify the predicate condition returns an empty array
                @param {array} the array to search
                @param {function} predicate The predicate function to test against each element
            */
            where: function (array, predicate) {

                var matches = [];

                if (typeof predicate !== 'function') {
                    throw new Error('predicate must be a function');
                }

                if (predicate.length !== 1) {
                    throw new Error('expected exactly one predicate argument');
                }

                for (var i = 0; i < array.length; i++) {
                    if (predicate(array[i])) {
                        matches.push(array[i]);
                    }
                }

                return matches;
            },
            
            /**
                returns true if this array contains any elements that satisfy the predicate condition, otherwise returns false
                @param {array} the array to search
                @param {function} predicate The predicate function to test against each element
            */
            any: function (array, predicate) {
        
                if (typeof predicate !== 'function') {
                    throw new Error('predicate must be a function');
                }

                if (predicate.length !== 1) {
                    throw new Error('expected exactly one predicate argument');
                }

                for (var i = 0; i < array.length; i++) {
                    if (predicate(array[i])) {
                        return true;
                    }
                }

                return false;
            },
            
            /**
                returns true if this array contains the specified element
                @param {array} the array to search
                @param {object} element The element to search for
            */
            contains: function (array, element) {

                if (element === null || typeof element === 'undefined') {
                    return false;
                }

                for (var i = 0; i < array.length; i++) {
                    if (element === array[i]) {
                        return true;
                    }
                }

                return false;
            },
            
            /**
                removes all elements that satisfy the predicate condition
                @param {array} the array to search
                @param {function} predicate The predicate function to test against each element
            */
            remove: function (array, predicate) {

                if (typeof predicate !== 'function') {
                    throw new Error('predicate must be a function');
                }

                if (predicate.length !== 1) {
                    throw new Error('expected exactly one predicate argument');
                }

                var removed = [];

                for (var i = 0; i < array.length; i++) {
                    if (predicate(array[i])) {
                        removed.push.apply(removed, array.splice(i--, 1));
                    }
                }

                return removed;
            },

            /**
                swaps two elements in the array
                @param {array} the array to act on
                @param {number} i the index of the first element to swap
                @param {number} j the index of the second element to swap
            */
            swap: function (array, i, j) {
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
                return array;
            },

            /**
                compacts an array, removing any null or undefined values
                @param {array} the array to compact
            */
            compact: function (array) {
                for (var i = array.length; i > -1; i--) {
                    if (utils.isNullOrUndefined(array[i])) {
                        array.splice(i, 1);
                    }
                }
            }
        },

        /**
            Math utility methods
        */
        math: {
            log10: function (value) {
                return Math.log(value) / Math.LN10;
            }
        },

        /**
            Date utility methods
        */
        date: {
            /**
                converts a date to an MSJSON string
            */
            toMSJSON: function (date) {
                return '/Date(' + date.getTime() + ')/';
            },
            
            /**
                creates a new date from an MSJSON string
            */
            fromMSJSON: function (jsonDate) {
                if (utils.isNullOrUndefined(jsonDate)) {
                    return jsonDate;
                }

                var parts = /\/Date\((-?\d+)([+-]\d{2})?(\d{2})?.*/.exec(jsonDate); //ignore jslint
                parts[2] = parts[2] || 0;
                parts[3] = parts[3] || 0;

                return new Date(+parts[1] + parts[2] * 3600000 + parts[3] * 60000);
            },
            
            /**
                returns a new date, adding a specified number of days to the date
                @param {number} days The number of days to add to the date
            */
            addDays: function (date, days) {
                var newDate = new Date(date.valueOf());
                newDate.setDate(newDate.getDate() + days);
                return newDate;
            },
            
            /**
                returns true if the date is today, otherwise false
                @param {date} date the date to check
            */
            isToday: function (date) {
                var today = new Date();
                return today.getDate() === date.getDate() &&
                    today.getMonth() === date.getMonth() &&
                    today.getYear() === date.getYear();
            },
            
            /**
                returns true if the day is saturday or sunday
                @param {date} date the date to check
            */
            isWeekend: function (date) {
                var day = date.getDay();
                return day === 0 || day === 6;
            }
        },

        /**
            Returns true if the value is null or undefined, otherwise returns false
            @param {object} value The value to test
            @return {boolean} true if value is null or undefined, otherwise false
        */
        isNullOrUndefined: function(value) {
            return value === null || typeof value === 'undefined';
        },

        /**
            Inherits the prototype methods from one constructor into another
        */
        inherits: function (Constructor, Super) {
            Constructor.prototype = new Super();
            Constructor.prototype.constructor = Constructor;
        },

        safe: function (callback) {
                return typeof callback === 'function' ? callback : function () { };
        }
    };

    return utils;
});