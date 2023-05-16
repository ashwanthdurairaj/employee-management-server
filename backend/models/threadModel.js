const mongoose = require('mongoose')

const threadSchema = mongoose.Schema(
  {
    
    text: {
      type: String,
      required: [true, 'Please add a text value'],
    },
    task_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    }
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Thread', threadSchema)
