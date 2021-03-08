 /**
 * http://usejsdoc.org/
 */
const mongoose = require('mongoose')
const autoIncrement = require("mongoose-auto-increment");

const customerSchema = new mongoose.Schema({
	
	name:{
		type:String,
		required : true
		},
		
		email:{
			type:String,
			required : true
			},
	 panumber:{
			type:String,
			required : true
			},		

	gender:{
	 type:String,
	 required : true
	 },	
	 lastname:{
		 type:String,
		 required : true
		 },
    accountType:{
    	type:String,
		required : true
    },	    
	phone:{
		type:String,
		required : true
    },
	
	amount:{
		type:String,
		required : true
	},
	accountCreationDate:{
		type:Date,
		required : true
   }
	
})
autoIncrement.initialize(mongoose.connection);
customerSchema.plugin(autoIncrement.plugin, {
  model: "Customer", // collection or table name in which you want to apply auto increment
  field: "acct_id", // field of model which you want to auto increment
  startAt: 10001, // start your auto increment value from 1
  incrementBy: 1, // incremented by 1
});
module.exports = mongoose.model('Customer',customerSchema)