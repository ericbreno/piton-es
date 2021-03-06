(function () {
    'use strict';

    let bodyParser = require('body-parser');
    let jwt = require('express-jwt');
    let cors = require('cors');
    let http = require("http");

    let usersRouter = require('../router/usersRouter'),
        notesRouter = require('../router/notesRouter');
    let routesMiddleware = {};

    let secret = '';
    let audience = '';

    /*
     * TODO: They should be environment variables... Just saying...
     * @author: Estácio Pereira
     */
    let authCheck;
    if (secret && audience) {
        authCheck = jwt({
            secret: secret,
            audience: audience
        });
    }

    /**
     * Configura a aplicação para as rotas de requisições
     *
     * @param {Object} app - Objeto que encapsula a aplicação Express
     */
    routesMiddleware.set = (app) => {
        app.use(cors());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        if (authCheck) {
            app.authMiddleware = authCheck;

            app.use('/api/users', app.authMiddleware, usersRouter);
            app.use('/api/notes', app.authMiddleware, notesRouter);
        } else {
            app.use('/api/users', usersRouter);
            app.use('/api/notes', notesRouter);
        }
    };

    module.exports = routesMiddleware;
})();
