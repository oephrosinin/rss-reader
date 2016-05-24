'use strict';

var db           = require('./Db');
const fs         = require('fs');
const Logger     = require('./Logger');
const Validator  = require('validator');
const config     = require('../../config');


var Functions = {

	validator: Validator,


	/**
	 * Обрезаем по бокам
	 * @public
	 * @param str
	 * @param chars
	 * @return string
	 */
	trim(str, chars){
		return Functions.isString(str) ? Functions.validator.trim(str, chars) : "";
	},


	/**
	 * Проверяем mongodb id на валидность
	 * @public
	 * @param id
	 * @return object
	 */
	isValid(id){
		return Functions.isString(id) ? Functions.validator.isMongoId(id) : false;
	},


	/**
	 * Проверяем mongodb id на валидность
	 * @public
	 * @param str
	 * @return object
	 */
	isURL(str){
		return Functions.isString(str) ? Functions.validator.isURL(str) : false;
	},


	/**
	 * Проверяем строка ли это
	 * @public
	 * @param value
	 * @return boolean
	 */
	isString(value){
		return typeof value == "string";
	},


	/**
	 * Очищаем строку от множественных пробелов
	 * @public
	 * @param value
	 */
	cleanString(value) {
		return value.replace(/\s\s+/g, " ")
	},


	/**
	 * Очищаем строку от множественных пробелов и по бокам
	 * @public
	 * @param value
	 */
	cleanSpaces(value = "") {
		return Validator.trim(Functions.cleanString(value));
	},


	/**
	 *
	 * Проверяем валидацию строки
	 * @public
	 * @param value
	 * @returns {boolean}
	 */
	validateSting(value) {
		return /^[а-яА-ЯёЁ\w\s\.\-\(\)\|\\_&,;:'"!@#]{1,100}$/i.test(value);
	},


	/**
	 * Добавляем свои функции для ответа
	 * @Public
	 * @param request
	 * @param response
	 * @param next
	 */
	addFunctionsResponse(request, response, next) {
		response['sendJson'] = (data, message) => {
			let res = {data};
			if (message) {res.message = message;}
			response.json(res);
		};

		response['sendError'] = (error) => response.json({error});
		next();
	},


	/**
	 * Проверяем id в параметре запроса на валидность
	 * @Public
	 * @param request
	 * @param response
	 * @param next
	 * @param id
	 */
	checkValidId(request, response, next, id) {
		if(Functions.isValid(id)) next();
		else response.sendStatus(404);
	}

};


module.exports = Functions;