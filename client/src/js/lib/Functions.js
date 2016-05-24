export default {


	/**
	 * Send request to server api
	 * @param url
	 * @param data
	 * @param method
	 * @returns {Promise}
	 */
	sendRequest(url, data, {method = "POST"} = {}) {
		return new Promise((resolve, reject) => {
			$.ajax({
				method,
				url,
				data: data ? JSON.stringify(data) : "",
				beforeSend: (xhr) => {
					xhr.setRequestHeader('Content-Type', 'application/json');
				},
				statusCode: {
					400: () => { return reject("Access denied") },
					404: () => { return reject("Page not found") }
				}
			})
				.done(( {error = "", data: {channel = {}} = {}, message = ""} ) => {
	
					if (error) {
						return reject(error);
					}
	
					resolve({channel, message});
	
				})
				.fail(() => {
					return reject("Cannot create the channel");
				});
		})
	},


	/**
	 * Get text letters stats
	 * @param str
	 * @returns {{labels: Array, data: Array, backgroundColor: Array, hoverBackgroundColor: Array}}
	 */
	getTextStat(str) {
		// Store the letter -> amount
		let data = {};
		// Backgrounds
		let bgs        = [];
		// Letters counter
		let matches    = [];
		// Unique letters in str
		let lettersSet = [];
	
		// Run loop and check all string, counting letters matches
		for (let i = 0; i < str.length; i++) {
			let letter = str[i];
	
			// If this letter is not in array
			if (!(letter in data)) {
				data[letter] = 1;
				bgs.push(this.generateColor(bgs));
				lettersSet.push(letter);
				continue;
			}
	
			// Increment letter amount
			data[letter] += 1;
		}
	
		for(let key in data) {
			matches.push(data[key]);
		}
	
		return {labels: lettersSet, data: matches, backgroundColor: bgs, hoverBackgroundColor: bgs};
	},


	/**
	 * Generate css color
	 * @param notInclude
	 * @returns {string}
	 */
	generateColor(notInclude = []) {
		let letters = '0123456789ABCDEF'.split('');
		let color = '#';
	
		for (let i = 0; i < 6; i++ ) {
			color += letters[Math.floor(Math.random() * 16)];
		}
	
		return notInclude.includes(color) ? generateColor(notInclude) : color;
	},


	/**
	 * Show the message
	 * @param msg
	 */
	showMsg(msg) {
		alert(msg);
	}
}