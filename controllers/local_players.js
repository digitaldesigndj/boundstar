var secrets = require('../config/secrets');
var DigitalOceanAPI = require('digitalocean-api');
var api = new DigitalOceanAPI(secrets.digitalocean.client_id, secrets.digitalocean.api_key);
var User = require('../models/User');
var _ = require('underscore');
var transients = require('transients');

/**
 * GET /players
 * Players List page.
 */

transients.setTransient( 'local_server_info', 'http://boundstar.com/status/server/status', 3600 );
transients.setTransient( 'local_player_info', 'http://boundstar.com/status/server/players', 3600 );

exports.players = function(req, res) {
  res.render('players', {
    title: 'Players'
    , players: transients.getTransient( 'local_player_info' )
  });
};

exports.managePlayer = function(req, res) {
  res.render('player', {
    title: 'Manage Player: ' + req.params.player
    , players: transients.getTransient( 'local_player_info' )
    , manage_player: req.params.player
  });
};

// exports.onlinePlayers = function(req, res) {
//   var players = transients.getTransient( 'local_player_info' );
//   res.render('players', {
//     title: 'Players'
//     , players: 
//   });
// };