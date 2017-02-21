var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    userEmail: String,
    content: {
        type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
});

var Message = module.exports = mongoose.model('Message', MessageSchema);
