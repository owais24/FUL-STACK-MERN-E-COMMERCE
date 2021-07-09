const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxLength: 18
    },
    lastname: {
        type: String,
        trim: true,
        maxLength: 18
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    encry_password: {
        type: String,
    }, 
    salt: String, //no curly braces due to single declaration
    role: {
        type: Number,
        default: 0 //higher the priviledges higher the no
    },
    purchases: {
        type: Array,
        default: []
    }
  }, { timestamps: true });

userSchema.virtual("password")
          .set(function(password){ // setters set the thing requires argument
              this._password = password //underscores make variable private
              this.salt = uuidv4()
              this.encry_password = this.securePassword(password)
          })
          .get(function(){  // only returns 
            return this._password
          })
userSchema.methods = {

    authenticate: function(plainpassword){
        return (this.securePassword(plainpassword) === this.encry_password)
    }, 
    
    securePassword: function(plainpassword){
        if(!plainpassword){
            return ""
        }
        try {
            crypto.createHmac('sha256', this.salt)
                  .update(plainpassword)
                  .digest('hex');
        } catch (error) {
            return ""
        }
    }
}
  module.exports = mongoose.model("User", userSchema )