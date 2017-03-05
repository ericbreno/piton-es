(function () {
    "use strict";

    let _ = require('../util/util'),
        request = require('request');

    /**
     * The AuthService deals with the Auth0 system. So, we can access the user
     * by it's identification token. Cool, right?
     */
    let authService = {};

    var mockUser = {
        clientID: "5vs4CySBu4m6EBnmAiZV09kls0",
        email: "mock@mock.com",
        given_name: "Mock",
        family_name: "Mock",
        email_verified: true,
        global_client_id: "Bf7b6CP6AlOXibuSTwguliKrymD",
        name: "Mock Mock",
        name_format: "{first} {last}",
        verified: true,
        picture: "https://lh3.googleusercontent.com/FzgMx_y3wgNmJKgSyGj4qmf6tmNgRNENn9RFMsAswBUGQn1qrlab-zCLytMENBPBDBg=w300"
    };

    /**
     * Gets the user from the authorization service (Auth0).
     *
     * @param {String}   idToken  User's identification token.
     * @param {Function} callback Callback function called after the request.
     */
    authService.getUser = (idToken, callback) => {
        if (!_.auth0) {
            callback(null, mockUser);
            return;
        }
        let options = {
            url: _.auth0 + _.tokeninfo,
            form: {
                id_token: idToken
            }
        };
        return request.post(options, (err, response, body) => {
            if (response.statusCode >= _.BAD_REQUEST) {
                err = err || 'Algo deu errado. Status da requisição: ' + response.statusCode;
                return callback(err, null);
            }
            return callback(err, JSON.parse(body));
        });
    };

    /**
     * Given an user, the function uses the authorization service (Auth0) to login.
     * (It is not that useful today, actually. Just for tests.)
     *
     * @param {Object}   user     User that wants to login.
     * @param {Function} callback Callback function called after the login.
     */
    authService.login = function (user, callback) {
        let optionsLogin = {
            url: _.auth0 + _.loginEndpoint,
            form: user
        };

        return request.post(optionsLogin, (err, response, body) => {
            if (response.statusCode >= _.BAD_REQUEST) {
                err = err || 'Algo deu errado. Status da requisição: ' + response.statusCode;
            }
            return callback(err, JSON.parse(body).id_token);
        });
    };

    module.exports = authService;
})();
