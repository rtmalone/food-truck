'use strict';

module.exports = Site;
var sites = global.nss.db.collection('sites');
var Mongo = require('mongodb');
var _ = require('lodash');
//var moment = require('moment');
//var dateFormat = 'HH:mm A';

function Site(attrs){
  this.eventName = attrs.eventName || attrs.truckName;
  this.address = attrs.address;
  this.truckName = attrs.truckName;
  this.startTime = attrs.startTime; //reminder: moment parses string from browser
  this.endTime = attrs.endTime; //reminder: moment parses string from browser
  this.date = attrs.date;
  this.coordinates= [attrs.lat * 1, attrs.lng * 1];
  this.truckId = Mongo.ObjectID(attrs.truckId);
}

Site.prototype.insert = function(fn){
  sites.insert(this, function(err, records){
    fn(records[0]);
  });
};

Site.update = function(id, obj, fn){
  var _id = Mongo.ObjectID(id);
  sites.update({_id:_id}, {$set: obj}, function(err, count){
    fn(count);
  });
};

Site.findAll = function(fn){
  sites.find().toArray(function(err, records){
    fn(records);
  });
};

Site.findById = function(id, fn){
  var _id = Mongo.ObjectID(id);
  sites.findOne({_id:_id}, function(err, site){
    fn(_.extend(site, Site.prototype));
  });
};

Site.findAllByTruckId = function(truckId, fn){
  var _truckId = Mongo.ObjectID(truckId);
  sites.find({truckId: _truckId}).toArray(function(err, records){
    fn(records);
  });
};

Site.findClosestByNow = function(query, fn){
  var lat = query.lat * 1;
  var lng = query.lng * 1;

  sites.find({'coordinates':{$nearSphere:{$geometry:{type:'Point', coordinates:[lat, lng]}},
    $maxDistance : 2500000}}).toArray(function(err, records){
    console.log('/////records///');
    fn(records);
  });
};

Site.deleteById = function(id, fn){
  var _id = Mongo.ObjectID(id);
  sites.remove({_id:_id}, function(err, count){
    fn(count);
  });
};
