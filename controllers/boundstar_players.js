var Player = require('../models/Player');
var secrets = require('../config/secrets');
var request = require('request');

/**
 * GET /players
 * Players page.
 */

exports.players = function(req, res) {
  Player.find( function (err, players) {
    if (err) return err;
    res.render('boundstar_players', {
      title: 'Players',
      players: players
    });
  });
};

/**
 * GET /voters
 * Voters page.
 */

exports.voters = function(req, res) {
  var url = 'http://starbound-servers.net/api/?object=servers&element=voters&key=87dgg44wyy86bgdoofau&month=current&format=json';
  request( { url: url, timeout: 1500 }, function (err, response, body) {
    if (!err && response.statusCode == 200) {
      res.render('voters', {
        title: 'Voters',
        voters: JSON.parse(body)
      });
    }
    else {
      req.flash('info', { msg: 'We could get voting info at this time.' });
      res.redirect('/');
    }
  });
};

  

