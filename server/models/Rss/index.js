'use strict';
let UTIL_PATH = "../../util/";

const config    = require('../../../config');
const db        = require(`${UTIL_PATH}Db`);
const Logger    = require(`${UTIL_PATH}Logger`);
const Functions = require(`${UTIL_PATH}Functions`);



var Rss = {


	/**
	 * Get app channels
	 * @public
	 * @param request
	 * @param response
	 */
	get(request, response) {
		// Get the channels
		return db.aggregate('channels',  [{$project: {name: "$name", link: "$link"}}])
			.then((channels) => {
				response.render('index', {channels});
			})
			.catch((error) => {
					response.sendError("Problem. Cannot get channels");
					Logger(error);
				}
			);
	},

	
	/**
	 * Create channel
	 * @public
	 * @param request
	 * @param response
	 */
	create(request, response){
		let {name, link} = request.body;

		// First type validation
		if ( !Functions.isString(name) || !Functions.isURL(link) ) {
			return response.sendStatus(400);
		}

		// clean our data
		name = Functions.cleanSpaces(name.toLowerCase());
		link = Functions.trim(link);

		//если имя не валидно, выкидываем ошибку
		if (!Functions.validateSting(name)) {
			return response.sendError("Cannot create user");
		}

		// Check If channel does not exist
		db.findOne("channels", {name})
			.then(channel => {

				// If no changes in db send the error
				if (channel) {
					return response.sendError("Channel with this name already exists");
				}

				// Insert data to the DB
				db.insert("channels", {name, link, creationDate: Date.now()})
					.then((channel) => {
						// send the channels back
						response.sendJson({channel}, "Channel was created")
					})
			})
			.catch((err) => {
				response.sendError("Error on site. Cannot create channel");
				Logger(err);
			});
	},


	/**
	 * Edit the channel
	 * @public
	 * @param request
	 * @param response
	 */
	edit(request, response){
		let {id: _id, name, link} = request.body;

		if ( !Functions.isString(name) || !Functions.isValid(_id) || !Functions.isString(link) ) {
			return response.sendStatus(400);
		}

		name = Functions.cleanSpaces(name.toLowerCase());
		link = Functions.trim(link);

		if(!Functions.validateSting(name)){
			return response.sendError("Field name is not valid");
		}

		if(!Functions.isURL(link)){
			return response.sendError("Field link is not valid");
		}

		_id = db.ObjectId(_id);

		// Check If channel does not exist
		db.findOne("channels", {_id: {$ne: _id}, name})
			.then(channel => {

				if (channel) {
					return response.sendError("Channel with this name already exist");
				}

				db.update('channels', {_id}, {$set: {name, link, updateDate: Date.now()}})
					.then((updated) => response.sendJson({channel: {name, link}}, "Data was updated"))
			})
			.catch((error) => {
				response.sendError("User update error");
				Logger(error);
			});
	},


	/**
	 * Remove the channel
	 * @public
	 * @param request
	 * @param response
	 */
	remove(request, response){
		let _id = db.ObjectId(request.params.id);
		db.remove("channels", {_id})
			.then(() => response.sendJson([], "Channel was removed"))
			.catch(error => {
				response.sendError("Problem. Cannot remove channel");
				Logger(error);
			});
	}

};

module.exports = Rss;