var Player = require('../models/Player');
var secrets = require('../config/secrets');

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
