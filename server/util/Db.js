'use strict';

const config = require('../../config');
const mongojs = require('mongojs');
const Logger = require('./Logger');
const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://' + config.mongodb.host + '/' + config.mongodb.db, (error, Db) => {
	if(error){
		console.log('[FAILED] Unable to establish connection to mongodb.');
	}
	else {
		driver.db = mongojs(Db);
		driver.ObjectId = driver.db.ObjectId;

		//Проверяем все ли нужные таблицы созданы
		driver._checkCollections()
			.then(() => {
				console.log('[OK] Applications connect to mongodb://' + config.mongodb.host + '/' + config.mongodb.db);
			})
			.catch(Logger);
	}
});


var driver = {

	
	/**
	 * Поиск записи
	 * @public
	 * @param collectionName
	 * @param query
	 * @returns Promise
	 */
	findOne(collectionName, query){
		var collection = driver.db.collection(collectionName);

		return new Promise((resolve, reject) => {
			collection.findOne(query, (err, doc) => {
				if(err){
					reject(err)
				}else{
					resolve(doc)
				}
			})
		});
	},


	/**
	 * Поиск записей
	 * @public
	 * @param collectionName
	 * @param query
	 * @returns Promise
	 */
	find(collectionName, query){
		var collection = driver.db.collection(collectionName);

		return new Promise((resolve, reject) => {
			collection.find(query, (err, col) => {
				if(err){
					reject(err)
				}else{
					resolve(col)
				}
			});
		})
	},


	/**
	 * Поиск записей используя метод aggregate
	 * @public
	 * @param collectionName
	 * @param query
	 * @returns Promise
	 */
	aggregate(collectionName, query){
		var collection = driver.db.collection(collectionName);

		return new Promise((resolve, reject) => {
			collection.aggregate(query, (err, col) => {
				if(err){
					reject(err)
				}else{
					resolve(col)
				}
			})
		})
	},

	
	/**
	 * Вставляем записи
	 * @public
	 * @param collectionName
	 * @param document
	 * @returns Promise
	 */
	insert(collectionName, document){
		var collection = driver.db.collection(collectionName);

		return new Promise((resolve, reject) => {
			collection.insert(document, (err, doc) => {
				if(err){
					reject(err)
				}else{
					resolve(doc)
				}
			})
		});
	},


	/**
	 * Обновляем записи
	 * @public
	 * @param collectionName
	 * @param query
	 * @param updateParams
	 * @param options
	 * @returns Promise
	 */
	update(collectionName, query, updateParams, options){
		var collection = driver.db.collection(collectionName);

		return new Promise((resolve, reject) => {
			collection.update(query, updateParams, options, (err, doc) => {
				if(err){
					reject(err)
				}else{
					resolve(doc)
				}
			})
		});
	},


	/**
	 * Удаляем запись
	 * @public
	 * @param collectionName
	 * @param query
	 * @returns Promise
	 */
	remove(collectionName, query){
		var collection = driver.db.collection(collectionName);

		return new Promise((resolve, reject) => {
			collection.remove(query, function(err, doc){
				if(err){
					reject(err)
				}else{
					resolve(doc)
				}
			})
		});
	},


	/**
	 * Проверяем на существования
	 * @public
	 * @param collectionName
	 * @param query
	 * @returns Promise
	 */
	exist(collectionName, query){
		var collection = driver.db.collection(collectionName);

		return new Promise((resolve, reject) => {
			collection.find(query, (err, col) => {
				if(err){
					reject(err)
				}else{
					col.length > 0 ? resolve(col[0]) : resolve(false);
				}
			})
		});
	},

		
	/**
	 * Проверяем существования коллекции
	 * @public
	 * @param collectionName
	 * @returns Promise
	 */
	existCollection(collectionName){

		return new Promise((resolve, reject) => {
			driver.db.getCollectionNames((err, res) => {
				if(err){
					reject(err)
				}else{
					var exist = res.indexOf(collectionName) > -1;
					resolve(exist)
				}
			})
		});

	},


	/**
	 * Удаляем коллекцию
	 * @public
	 * @param collectionName
	 * @returns Promise
	 */
	drop(collectionName){
		var collection = driver.db.collection(collectionName);

		return new Promise((resolve, reject) => {
			collection.drop((err, col) => {
				if(err){
					reject(err)
				}else{
					resolve(true);
				}
			})
		});

	},
	

	/**
	 * Get portal collections
	 * @private
	 */
	_getCollections() {
		return new Promise((resolve, reject) => {

			let collections = [
				'channels'
			];


			driver.db.getCollectionNames((error, currentCollections) => {
				if (error) {
					return reject(error);
				}				

				if(currentCollections.length) {
					collections = driver.reduceArrayByArray(collections, currentCollections)
				}

				return resolve(collections);
			})

		});
	},


	/**
	 * Check portal collections
	 * @private
	 */
	_checkCollections() {
		return new Promise((resolve, reject) => {
			return driver._getCollections()
				.then(collections => {
					if (!collections.length) {
						return resolve(true);
					}

					// If we collections no empty trying to create collections
					let checkCollections = () => {
						let collectionName = collections.shift();
						console.log("\nCollections creation: ");
						driver.db.createCollection(collectionName, {}, (error, info) => {
							if (error) {
								console.warn(`> Cannot create collection: ${collectionName}`);
								return reject(error);
							}

							console.log(`> Collection:  ${collectionName} was created successfully\n`);
							return !collections.length ? resolve(true) : checkCollections();
						})
					};

					checkCollections();
				})
		})
	},


	/**
	 * Get diff from arrays
	 * @param collections
	 * @param currentCollections
	 */
	reduceArrayByArray(collections, currentCollections){
		let newCollections = [];
		for (let i = 0; i < collections.length; i++) {
			if (currentCollections.indexOf(collections[i]) == -1) {
				newCollections.push(collections[i])
			}
		}
		return newCollections;
	}
	
};

module.exports = driver;