exports.page = function( req, res ) {
	user = req.query.name;
	console.log( user );

	// if(  ) {

	// } else {
	// 	console.log( )
	// }
	var randomstring = Math.random().toString(36).slice(-8);
	res.render('player', { 
		title: 'Profile Page',
		user: encodeURIComponent( req.query.name ),
		extension: 'jpg'
	});
};