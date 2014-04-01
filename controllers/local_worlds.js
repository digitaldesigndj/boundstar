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

transients.setTransient( 'local_server_info', 'http://boundstar.com/status/server/worlds', 3600 );

exports.index = function(req, res) {
  res.render('worlds', {
    title: 'Worlds'
    , worlds: transients.getTransient( 'local_server_info' )
  });
};

exports.sectorIndex = function(req, res) {
  res.render('worlds', {
    title: 'Worlds'
    , worlds: _.sortBy( _.where( transients.getTransient( 'local_server_info' ), { sector: req.params.sector }), function(o) { return o.numLoads; }).reverse()
  });
};