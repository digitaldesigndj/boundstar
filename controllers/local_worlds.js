var secrets = require('../config/secrets');
var DigitalOceanAPI = require('digitalocean-api');
var api = new DigitalOceanAPI(secrets.digitalocean.client_id, secrets.digitalocean.api_key);
var User = require('../models/User');
var _ = require('underscore');
var transients = require('transients');

/**
 * GET /worlds
 * Worlds List page.
 */

transients.setTransient( 'local_world_info', 'http://boundstar.com/status/server/worlds', 3600 );

exports.worlds = function(req, res) {
  transients.getTransient( 'local_world_info', function (worlds) {
    res.render('worlds', {
      title: 'Worlds'
      , worlds: worlds
    });
  });
};

exports.worldsBySector = function(req, res) {
  transients.getTransient( 'local_world_info', function (worlds) {
    res.render('worlds', {
      title: 'Worlds'
      , worlds: _.sortBy( _.where( worlds, { sector: req.params.sector }), function(o) { return o.numLoads; }).reverse()
    });
  });
};

exports.systems = function(req, res) {
  transients.getTransient( 'local_world_info', function (worlds) {
    res.render('systems', {
      title: 'Systems'
      , worlds: worlds
    });
  });
};

exports.systemsBySector = function(req, res) {
  transients.getTransient( 'local_world_info', function (worlds) {
    res.render('systems', {
      title: 'Systems'
      , worlds: _.sortBy( _.where( worlds, { sector: req.params.sector }), function(o) { return o.numLoads; })
    });
  });
};