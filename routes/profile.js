exports.page = function(req, res){
	var randomstring = Math.random().toString(36).slice(-8);

	res.render('profile', { 
		title: 'Profile Page', 
		user: encodeURIComponent( req.query.name ),
		passcode: randomstring
	});
};