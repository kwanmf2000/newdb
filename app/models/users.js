const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    firstName: {
        type:String,
        required: [true, 'First name is required']
    }, 
    lastName: {
        type:String,
        required: [true, 'Last name is required']
    },
    email: {
      type: String,
      unique: true,
      match: [/.+\@.+\..+/, "Please fill a valid e-mail address"]
    },
    username: {
      type: String,
      unique: true,
      required: 'Username is required',
      trim: true
    },
    hashed_password: {
      type: String,
      required: 'Passowrd is required',
    },
    salt: {
      type: String
    },
    created: {
      type: Date,
      default: Date.now,
      immutable: true
    },
    updated: {
      type: Date,
      default: Date.now
    },
    admin: {
      type: Boolean,
      default: false
    }
    
  },
    {
      collection: "users"
    }
  );
  
  UserSchema.virtual('fullName')
    .get(function () {
      return this.firstName + ' ' + this.lastName;
    })
    .set(function (fullName) {
      let splitName = fullName.split(' ');
      this.firstName = splitName[0] || '';
      this.lastName = splitName[1] || '';
    });
  
  
  UserSchema.virtual('password')
    .set(function (password) {
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters.')
      }
      else {
         UserSchema.methods.authenticate(password);      }
    });
  
 
  
  UserSchema.methods.authenticate = function (password) {
    return password;
  };
  
  // Ensure virtual fields are serialised.
  UserSchema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) { 
      delete ret._id;
      delete ret.hashed_password;
      delete ret.salt;
    }
  });
  
  module.exports = mongoose.model('User', UserSchema);
  