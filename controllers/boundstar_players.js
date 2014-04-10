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

var voter_cache = {};
exports.voters = function(req, res) {
  var url = 'http://starbound-servers.net/api/?object=servers&element=voters&key=87dgg44wyy86bgdoofau&month=current&format=json';
  request( { url: url, timeout: 1500 }, function (err, response, body) {
    if (!err && response.statusCode == 200) {
      voter_cache = JSON.parse(body)
      res.render('voters', {
        title: 'Voters',
        voters: voter_cache
      });
    }
    else {
      req.flash('errors', { msg: 'Sorry, We could not get voting info at this time.' });
      res.redirect('/');
    }
  });
};

/**
 * GET /profile
 * Voters page.
 */

exports.profile = function(req, res, next) {
  Player.findOne({ 'player': req.params.player }, function(err, player) {
    if (err) return next(err);
    var url = 'http://forum.boundstar.com/api/user/'+
    player.forum.replace(/ /g,'-').toLowerCase();
    request( { url: url, timeout: 1500 }, function (err, response, body) {
      if (!err && response.statusCode == 200) {
        console.log( 'success' );
        res.render('profile', {
          title: req.params.player+'\'s Profile',
          player: player,
          forum: JSON.parse(body)
        });
      }
      else {
        res.render('profile', {
          title: req.params.player+'\'s Profile',
          player: player,
          forum: false
        });
      }
    });
  });
};


// exports.profile = function(req, res, next) {
//   async.parallel({
//     player:function(callback){
//       Player.findOne({ 'player': req.params.player }, function(err, player) {
//         if (err) return next(err);
//         console.log( req.params.player, player );
//         callback(err, 'player');
//       });
//     },
//     player:function(callback){
//       var url = '';
//       request( { url: url, timeout: 1500 }, function (err, response, body) {
//         if (!err && response.statusCode == 200) {
//           res.render('voters', {
//             title: 'Voters',
//             voters: JSON.parse(body)
//           });
//         }
//         else {
//           callback(err, false);
//         }
//       });
//     }
//   },
//   function(err, results){
//     res.render('profile', {
//       title: req.params.player+'\'s Profile',
//       player: results.player
//     });
//   });
// };
