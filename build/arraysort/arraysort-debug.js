/*
Copyright (c) 2010, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.com/yui/license.html
version: 3.2.0
build: nightly
*/
YUI.add('arraysort', function(Y) {

var LANG = Y.Lang,
    ISVALUE = LANG.isValue,
    ISSTRING = LANG.isString;

Y.ArraySort = {
    /**
     * Comparator function for simple case-insensitive string sorting.
     *
     * @method compare
     * @param a {Object} First sort argument.
     * @param b {Object} Second sort argument.
     * @param desc {Boolean} True if sort direction is descending, false if
     * sort direction is ascending.
     * @return {Boolean} Return -1 when a < b. Return 0 when a = b.
     * Return 1 when a > b.
     */
    compare: function(a, b, desc) {
        if(!ISVALUE(a)) {
            if(!ISVALUE(b)) {
                return 0;
            }
            else {
                return 1;
            }
        }
        else if(!ISVALUE(b)) {
            return -1;
        }

        if(ISSTRING(a)) {
            a = a.toLowerCase();
        }
        if(ISSTRING(b)) {
            b = b.toLowerCase();
        }
        if(a < b) {
            return (desc) ? 1 : -1;
        }
        else if (a > b) {
            return (desc) ? -1 : 1;
        }
        else {
            return 0;
        }
    }
};



}, '3.2.0' ,{requires:['yui-base']});
