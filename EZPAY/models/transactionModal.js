/**
 * http://usejsdoc.org/
 */
 /**
 * http://usejsdoc.org/
 */
const mongoose = require('mongoose')
const autoIncrement = require("mongoose-auto-increment");

const transactionSchema = new mongoose.Schema({
	
	narration:{
		type:String,
		required : true
	},
   
    depositamt:{
    	type:Number
    	
    },
    withdrawlamt:{
    	type:Number
    	
    },
    closingbalance:{
    	type:Number,
    	required:true
    },

	acctId:{
		type:String
		
	},

	transactionDate:{
		type:Date,
		required : true
				
	}
	
})
autoIncrement.initialize(mongoose.connection);
transactionSchema.plugin(autoIncrement.plugin, {
  model: "Tansaction", // collection or table name in which you want to apply auto increment
  field: "transaction_id", // field of model which you want to auto increment
  startAt: 2000010, // start your auto increment value from 1
  incrementBy: 1, // incremented by 1
});

module.exports = mongoose.model('Transaction',transactionSchema)