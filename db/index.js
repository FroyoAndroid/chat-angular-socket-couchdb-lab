var pouchdb = require('pouchdb');

module.exports = function() {
	var connection = new pouchdb('http://localhost:5984/chat');
	return {
		addMessage: function(msg) {
			console.log(msg);
			connection.post(msg);
		},
		getMessages: function() {
			return connection.allDocs({
				include_docs: true,
				attachments: false
			});
		}
	}
}
