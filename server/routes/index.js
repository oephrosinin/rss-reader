'use strict';

const path          = require('path');
const express       = require('express');
const bodyParser    = require('body-parser');

const Functions     = require('../util/Functions');

const Rss           = require('../models/Rss');

let router = express.Router();

/**
 * Парсим тела запроса для application/json
 */
router.use(bodyParser.json());

/**
 * Добавляем свои методы в response
 */
router.use(Functions.addFunctionsResponse);


/**
 * Проверяем id в параметре запроса на валидность
 */
router.param('id', Functions.checkValidId);


/**
 * API для работы с каналами
 */
router.get( '/',                       Rss.get);
router.get( '/rss/remove/channel/:id', Rss.remove);
router.post('/rss/create/channel',     Rss.create);
router.post('/rss/edit/channel',       Rss.edit);


/**
 * Если ни один роут не сработал, отправляем 404
 */
router.use((request, response) => {
  response.render('404');
  response.sendStatus(404);
});


module.exports = router;