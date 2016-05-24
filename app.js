'use strict';

const express = require('express');
const path    = require('path');
const config  = require('./config');
const routes  = require('./server/routes');

/**
 * Инициалезируем express сервер
 */
let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'jade');

// proxy static content
app.use(express.static(path.join(__dirname, 'client/public')));

/**
 * Подключаем список роутов
 */
app.use(routes);

/**
 * Запускаем сервер
 */
app.listen(config.server.port, () => {
  console.log('[OK] Api server listening on port ' + config.server.port);
});