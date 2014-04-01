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
 * GET /
 * Home page.
 */

var cachedAt = 0;
var cacheFor = 300;
var starbound_servers = [];
var starbound_admins = [];

function getServerInfo( callback ) {
  if( cachedAt + cacheFor <= Math.round( new Date().getTime() / 1000 ) ) {
    cachedAt = Math.round( new Date().getTime() / 1000 );
    User.find('',function(err,users) {
      var server_list = [];
      starbound_servers = [];
      starbound_admins = [];
      _.each(users, function(user,i) {
        if( user.server != 0 ) {
          server_list.push( user.server );
        }
      });
      api.dropletGetAll( function ( err, droplets ) {
        _.each( droplets, function( droplet, i ) {
          if( _.contains( server_list, droplet.id ) ) {
            starbound_admins.push( _.findWhere(users, {server: droplet.id}) );
            starbound_servers.push(droplet);
          }
          if ( i+1 === droplets.length ) {
            console.log( starbound_servers, starbound_admins );
          }
        });
        callback( starbound_servers, starbound_admins );
      });
    });
  }
  else {
    callback( starbound_servers, starbound_admins );
  }
}

exports.index = function(req, res) {
  getServerInfo( function( starbound_servers, starbound_admins ) {
    res.render('home', {
      title: 'Welcome to StarryDex Beta'
      , servers: starbound_servers
      , admins: starbound_admins
    });
  });
};


/**
 * GET /
 * Home page.
 */

// exports.index = function(req, res) {
//   res.render('home', {
//     title: 'Home'
//   });
// };
