const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
    {
      title: {
        type: String,
        // required: [true, 'Please add a title'],
      },
      description: {
        type: String,
        // required: [true, 'Please add a description'],
      },
      deadline: {
        type: Date,
        // required: [true, 'Please add deadline date'],
      },
      employee: {
        type: mongoose.Schema.Types.ObjectId,
      },
    },
    {
      timestamps: true,
    }
  )
  
module.exports = mongoose.model('Task', taskSchema)