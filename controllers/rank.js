var secrets = require('../config/secrets');
var DigitalOceanAPI = require('digitalocean-api');
var api = new DigitalOceanAPI(secrets.digitalocean.client_id, secrets.digitalocean.api_key);
var User = require('../models/User');
var World = require('../models/World');
var Player = require('../models/Player');
var _ = require('underscore');
var async = require('async');
var jsdom = require('jsdom');
var request = require('request');

/**
 * POST /claim
 * Upgrader
 */

exports.claim = function (req, res, next) {
  Player.findById(req.user.id, function (err, player) {
    if (err) return next(err);
    player.system = {};
    player.system.sector = req.body.sector || '';
    player.system.x = req.body.x || '';
    player.system.y = req.body.y || '';
    player.system.z = req.body.z || '';
    player.system.planet = req.body.planet || '';
    player.system.size = req.body.size || '0';

    player.system_coords = req.body.system_coords || '';
    player.save(function (err) {
      if (err) return next(err);
      req.flash('success', { msg: 'You claimed system '+req.body.system_coords });
      res.redirect('/rank');
    });
  });
}

/**
 * POST /upgrade
 * Upgrader
 */

exports.upgrade = function (req, res, next) {
  Player.findById(req.user.id, function (err, player) {
    if (err) return next(err);
    switch(player.rank) {
    case 'Recruit':
      if ( player.thismonth_votes > 0 && player.forum_posts > 0 && player.forum_rep > 0 ) {
        player.rank = 'Player';
        player.save(function (err) {
          if (err) return next(err);
          req.flash('success', { msg: 'Rank Up! Player' });
          res.redirect('/rank');
        });
      } else {
        req.flash('error', { msg: 'You are not eligible for a new rank.' });
        res.redirect('/rank');
      }
      break;
    case 'Player':
      if ( player.thismonth_votes >= 3 && player.forum_posts >= 5 && player.forum_rep >= 5 ) {
        player.rank = 'Explorer';
        player.save(function (err) {
          if (err) return next(err);
          req.flash('success', { msg: 'Rank Up! Explorer' });
          res.redirect('/rank');
        });
      } else {
        req.flash('error', { msg: 'You are not eligible for a new rank.' });
        res.redirect('/rank');
      }
      break;
    }
  });
}

/**
 * GET /rank
 * Rank page.
 */

exports.index = function (req, res, next) {
  async.parallel({
    worlds: function (callback) {
      World.find('', function (err, results) {
        callback(err, results);
      });
    },
    votes: function (callback) {
      url = 'http://starbound-servers.net/api/?object=servers&element=voters&key=87dgg44wyy86bgdoofau&month=current&format=json';
      request( { url: url, timeout: 3000 }, function (err, response, body) {
        if (!err && response.statusCode == 200) {
          callback(err, JSON.parse(body).voters );
        }
        else {
          callback(err, false );
        }
      });
    },
    forum_stats: function (callback) {
      var forum_stats = {};
      url = 'http://forum.boundstar.com/api/user/'
      +req.user.forum.replace(/ /g,'-').toLowerCase();
      request( { url: url, timeout: 3000 }, function (err, response, body) {
        if (!err && response.statusCode == 200) {
          forum_profile = JSON.parse(body);
          forum_stats.rep = forum_profile.reputation;
          forum_stats.posts = forum_profile.postcount;
          callback(err, forum_stats );
        }
        else {
          callback(err, false );
        }
      });
    }
  },
  function (err, results) {
    if (err) return next(err);
    Player.findById(req.user.id, function (err, player) {
      if (err) return next(err);
      // @todo notify when numbers go up
      _.each( results.votes, function ( v, i ) {
        if( v.nickname == req.user.player ) {
          player.alltime_votes = v.votes || '';
          player.thismonth_votes = v.votes || '';
        }
      });
      player.forum_posts = results.forum_stats.posts || '';
      player.forum_rep = results.forum_stats.rep || '';
      player.save(function (err) {
        if (err) return next(err);
        res.render('rank', {
          title: 'Rank Manager'
          , worlds: results.worlds
          , votes: results.votes
          , forum_stats: results.forum_stats
        });
      });
    });
  });
};



  // var cachedAt = 0;
  // var cacheFor = 300;
  // var starbound_servers = [];
  // var starbound_admins = [];

  // function getServerInfo( callback ) {
  //   if( cachedAt + cacheFor <= Math.round( new Date().getTime() / 1000 ) ) {
  //     cachedAt = Math.round( new Date().getTime() / 1000 );
  //     User.find('',function (err,users) {
  //       var server_list = [];
  //       starbound_servers = [];
  //       starbound_admins = [];
  //       _.each(users, function (user,i) {
  //         if( user.server != 0 ) {
  //           server_list.push( user.server );
  //         }
  //       });
  //       api.dropletGetAll( function ( err, droplets ) {
  //         _.each( droplets, function ( droplet, i ) {
  //           if( _.contains( server_list, droplet.id ) ) {
  //             starbound_admins.push( _.findWhere(users, {server: droplet.id}) );
  //             starbound_servers.push(droplet);
  //           }
  //           if ( i+1 === droplets.length ) {
  //             console.log( starbound_servers, starbound_admins );
  //           }
  //         });
  //         callback( starbound_servers, starbound_admins );
  //       });
  //     });
  //   }
  //   else {
  //     callback( starbound_servers, starbound_admins );
  //   }
  // }
