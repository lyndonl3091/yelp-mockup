'use strict';

const mongoose = require('mongoose');

let businessSchema = new mongoose.Schema ({
  user: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  name: {type: String}
})

// businessSchema.statics.addUser = function(businessId, userId, cb) {
//
//   this.findById(businessId, function(err, business) {
//     if(err) return cb(err)
//
//     business.setUser(userId, cb);
//   });
// };
//
// businessSchema.methods.setUser = function(userId, cb) {
//   this.user.push(userId);
//   this.save(cb);
// };



let Business = mongoose.model('Business', businessSchema);

module.exports = Business;
