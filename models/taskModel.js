const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date:{type:Date,required:true},
    status:{type:String, required:true},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comments: [{ body: String, date: Date }],

})



const task = mongoose.model('task', taskSchema);

module.exports = task;