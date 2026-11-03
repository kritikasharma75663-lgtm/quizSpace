const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: [true, 'Question must belong to a quiz'],
      index: true,
    },
    questionText: {
      type: String,
      required: [true, 'Please provide question text'],
      trim: true,
    },
    options: {
      type: [String],
      validate: {
        validator: function (opts) {
          return Array.isArray(opts) && opts.length >= 2 && opts.length <= 6;
        },
        message: 'A question must have between 2 and 6 options (standard is 4)',
      },
      required: true,
    },
    correctAnswer: {
      type: Number,
      required: [true, 'Please specify the correct answer option index (0 to N-1)'],
      min: 0,
    },
    explanation: {
      type: String,
      default: '',
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Question', questionSchema);
