/**
 * http://usejsdoc.org/
 */
const express=require('express')
const mongoose = require('mongoose')
const router=express.Router()
var dateFormat = require('dateformat');
var Promise = require('es6-promise').Promise;


const customerModal=require('../models/customer')
const transactionModal=require('../models/transactionModal')
const availableBalnceModal=require('../models/availableBalanceModal')
module.exports=router
var MongoClient = require('mongodb').MongoClient;

//var MongoClient = require('mongodb');



//User Creation here ******************//

router.get('/createAccount',(req,res) => {
	var accountID='';
	
	res.render("customercreate",{'message':''})
})

router.post('/createAccount',async  (req,res) => {
	var accountID= await saveCustomer(req);
		 
		 var message;
		 if(accountID){
		 message="Account has been created Successfully.Account id is"+accountID;
		 }
		 else{
			  message="The Customers already exists.Please check the phone number and Account Type";
		 }
	try{

		
		res.render("customercreate",{'message': message})
		}
		catch(err){
			console.log("this is error")
		}
	

	 })
	 
	 
	 //Customer get Available Balance here *****************//

router.get('/getBalance',(req,res) => {
	let availablebalanceData={}
	res.render("available-balance",{'availablebalanceData':availablebalanceData})
})

router.get('/getavailableBalance',async (req,res) => {
	
	console.log("the account id is"+req.query.acctno)
	
let availablebalanceData = await getBalnce(req.query.acctno)
	
	let CustomersData =await customerModal.find({'acct_id': req.query.acctno})

	
	res.render('available-balance',{'availablebalanceData':availablebalanceData,'CustomersData': CustomersData});
})

//Users can Transfer Amount **********************/////////////

router.get('/transferAmount',(req,res) => {
	let message='';
	res.render('amountTransfer')
})

router.post('/transferAmt',async (req,res) => {
	
	let status=await transferAmout(req);
	var  message;
	if(status == 0){
		message="Insuffient Amount!";
		console.log(message);
	}
	else if(status == 1){
		
		message="Amount transfered Successfully";
	}
	res.send(message);

})

//Users Get History records  ***********************************//

router.get('/getHistroy',(req,res) => {
	
	var historyData={};
	res.render("transfer-history",{'historyData':historyData})
})
router.get('/getHistoryData',async (req,res) => {
	
	let acctno=req.query.acctno;
	var historyData=await transactionModal.find({'acctId' : acctno })
    
	
    console.log(historyData)
		
	
	res.render("transfer-history",{'historyData':historyData})
})



router.get('/checkToAccount',async (req,res) => {
	let acctno=req.query.accountID;
	console.log("account id is"+acctno);
	var data=await availableBalnceModal.find({'acctId':acctno})
	try{
		res.send(data);
	}catch(err){
		res.send(err)
	}
})



async function saveCustomer( req){
	
	var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
	
	var accountType;
	 
	
	if(req.body.accountType == 1){
		
		
         accountType='Savings Account'
	}
	else if(req.body.accountType == 2){
		accountType='Salary Accont'
	}
	else if(req.body.accountType == 3){
		accountType='Current Account'
	}
	 var acctID='';
	var usersData=await customerModal.find({'phone' : req.body.phonenumber,'accountType':accountType});
	
	if(usersData.length == 0){
	 let  users = new customerModal({
				
				name: req.body.username,   
				phone: req.body.phonenumber,
				email: req.body.email,
				
				panumber : req.body.pannumber,
				
				gender: req.body.gender,
				lastname: req.body.lastname,
				
				accountType:accountType,
				amount:req.body.depositAmt,
				accountCreationDate : day
		  });
	  let aa=await users.save();
		console.log("the record has inserted successfully")
		

		 var lastdata=await customerModal.find({'phone' : req.body.phonenumber,'accountType':accountType});
		 
		    
		   
		    console.log(lastdata[0].acct_id);
		    acctID=lastdata[0].acct_id
		    day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
   const transaction=new transactionModal({
				
				narration: "EzPay --Initial Transaction",
				phone: req.body.phonenumber,
				depositamt:req.body.depositAmt,
				closingbalance:req.body.depositAmt,
				acctId : acctID,
				transactionDate:day,
		         });
		    await  transaction.save();
		    
		    const availableBalanceModal=new availableBalnceModal({
		    	acctId             : acctID, 
		    	availableBalance   :req.body.depositAmt,
		    	transactionDate : day,
		    	accountType : accountType
		    })
		    await  availableBalanceModal.save();
		    
		    return acctID;
		    
	}
	else{
		return acctID;
	}
	
}
async function getBalnce(accountId){
	let availablebalanceData=await availableBalnceModal.find({'acctId':accountId})
	console.log(availablebalanceData)
	return availablebalanceData;
	
}

async function transferAmout(req){
	
	var fromAccount=req.body.fromaccountId;
	var amount=req.body.transferAmount;
	var toAccount=req.body.toaccountId
	
	var message;
	var checkAvailableBalance_fromAccount=await availableBalnceModal.find({'acctId': fromAccount});
	
	if(checkAvailableBalance_fromAccount[0].availableBalance > amount){
		
		var remainingBalance=checkAvailableBalance_fromAccount[0].availableBalance-amount;
		
		
		
		var day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
  
		const fromAccount_transaction=new transactionModal({
			
			narration: "EzPay --Transfer to Acct id:"+toAccount,
			phone: req.body.phonenumber,
			depositamt: 0,
			withdrawlamt: amount,
			closingbalance:remainingBalance,
			acctId : fromAccount,
			transactionDate:day,
	         });
	    await  fromAccount_transaction.save();
	    
	    await availableBalnceModal.updateOne({'acctId' : fromAccount },
	    		{
	    		$set: { 'availableBalance': remainingBalance, 'transactionDate': day }
	    		});
	    		
	
	var checkAvailableBalance_ToAccount=await availableBalnceModal.find({'acctId': toAccount});
	
	var totalAmount=parseInt(checkAvailableBalance_ToAccount[0].availableBalance) + parseInt(amount);
	
	day=dateFormat(new Date(), "yyyy-mm-dd h:MM:ss");
	
	const toAccount_transaction=new transactionModal({
		
		narration: "EzPay --Deposit from Acct id:"+fromAccount,
		
		depositamt: amount,
		withdrawlamt: 0,
		closingbalance:totalAmount,
		acctId : toAccount,
		transactionDate:day,
         });
    await  toAccount_transaction.save();
    
    await availableBalnceModal.updateOne({'acctId' : toAccount },
    		{
    		$set: { 'availableBalance': totalAmount , 'transactionDate': day}
    		});
  var  status=1
    		
   return status;
	}
	else{
	var	 status=0;
	return status;
	}
	
	}
	
	

