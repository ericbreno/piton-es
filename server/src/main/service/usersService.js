(function () {
    'use strict';
    let _ = require('../util/util'),
        authService = require('./authService');

    /**
     * The usersService deals with the more complex user detail/logic. It's
     * responsible for anything related to caching the users too.
     * It is extremely useful to us to identify the logged user.
     *
     * @author Estácio Pereira.
     */
    let usersService = {
        cache: {}
    };

    /**
     * Gets an element from the cache. Required to control the more accessed
     * elements
     *
     * @param   {string} cache Name of the cache.
     * @param   {string} key   Key of the desired element.
     * @returns {Object} Value in cache.
     */
    function getFromCache(cache, key) {
        usersService[cache][key].touched = Date.now();
        return usersService[cache][key].value;
    }

    /**
     * Puts an element on the cache.
     *
     * @param   {string} cache Name of the cache.
     * @param   {string} key   Key of the desired element.
     * @param   {Object} value Value to be put on cache.
     */
    function putOnCache(cache, key, value) {
        usersService[cache][key] = {
            value: value,
            touched: Date.now()
        };
    }

    /**
     * The elements that have not been accessed recently (one hour... yeah...)
     * will be deleted.
     *
     * @param {string} cache Name of the cache.
     */
    function clearCache(cache) {
        _.each(usersService[cache], function (element, key) {
            if (element.touched + _.TEN_MINUTES < Date.now()) delete usersService[cache][key];
        });
    }

    /**
     * Verifies if a given user is cached.
     *
     * @param   {Object}  user Requested user.
     * @returns {boolean} true if the user is cached, false otherwise.
     */
    usersService.isCached = user => !_.isUndefined(_.invert(usersService.cache)[JSON.stringify(user)]);

    /**
     * Adds a user to cache.
     *
     * @param {String} token Token of the user.
     * @param {Object} user  User to be cached.
     */
    usersService.cacheUser = (token, user) => {
        if (!_.isEmpty(token) && !_.isEmpty(user)) {
            let reverseCache = _.invert(usersService.cache);
            user = JSON.stringify(user);
            if (!_.isUndefined(reverseCache[user])) {
                delete usersService.cache[reverseCache[user]];
            }
            putOnCache('cache', token, user);
        }
    };

    /**
     * Gets the user with the given token, if it exists (error, otherwise).
     * If the user is cached, we don't need to request Auth0.
     *
     * @param {String}   idToken  User's identification token.
     * @param {Function} callback Callback function called after the query.
     */
    usersService.getUser = (idToken, callback) => {
        if (usersService.cache[idToken]) {
            return callback(null, JSON.parse(getFromCache('cache', idToken)));
        }
        return authService.getUser(idToken, (err, result) => {
            if (!err) {
                usersService.cacheUser(idToken, result);
            }
            return callback(err, result);
        });
    };

    /**
     * Activates the cache cleaner.
     */
    (() => {
        setInterval(() => {
            clearCache('cache');
        }, _.TEN_MINUTES);
    })();

    module.exports = usersService;
})();
