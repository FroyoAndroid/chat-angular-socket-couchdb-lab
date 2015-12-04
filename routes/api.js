var db = require('../db');
db = db();

exports.messages = function (req, res) {
	db.getMessages().then(function(ans, err) {
		res.json(ans.rows.map(function(item){return {message: item.doc.message, user: item.doc.user}}));
	});
};