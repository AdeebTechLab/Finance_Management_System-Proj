const mongoose = require("mongoose"); 
const { financeDB } = require("../db");

const financeSchema = new mongoose.Schema({ 
    user_id:  String,
    budget: [{
        date: Date,
        amount: Number,
        source: String  
    }],
    expenses: [{
        date: Date, 
        amount: Number,
        reason: String  
    }],
    investments: [{
            date: { type: Date},
            company: {type: String},
            amount: { type: Number},
            returns: {type: Number},
            type: { type: String }
        }],
    goals: [{
        name: String,
        amount: Number,
        deadline: Date,
    }]
});

module.exports = financeDB.model("Finance", financeSchema);
