/**
 * http://usejsdoc.org/
 */
/**
 * http://usejsdoc.org/
 */
 /**
 * http://usejsdoc.org/
 */
const mongoose = require('mongoose')
const autoIncrement = require("mongoose-auto-increment");

const transactionSchema = new mongoose.Schema({
	
	
    availableBalance:{
    	type:Number,
    	required:true
    },
    
	acctId:{
		type:String,
		required:true
		
	},
	accountType:{
		type:String,
		required:true
		
	},

	transactionDate:{
		type:Date,
		required : true
		
			
	}
	
})


module.exports = mongoose.model('AvailableBalance',transactionSchema)