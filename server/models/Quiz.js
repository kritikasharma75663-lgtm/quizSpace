const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a quiz title'],
      trim: true,
      maxlength: [120, 'Quiz title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a quiz description'],
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please assign a category to the quiz'],
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
      index: true,
    },
    duration: {
      type: Number,
      required: [true, 'Please specify duration in minutes'],
      min: [1, 'Duration must be at least 1 minute'],
      max: [180, 'Duration cannot exceed 180 minutes'],
      default: 15,
    },
    passingPercentage: {
      type: Number,
      required: [true, 'Please specify passing percentage'],
      min: [10, 'Passing percentage must be at least 10%'],
      max: [100, 'Passing percentage cannot exceed 100%'],
      default: 60,
    },
    published: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for questions count
quizSchema.virtual('questionCount', {
  ref: 'Question',
  localField: '_id',
  foreignField: 'quiz',
  count: true,
});

module.exports = mongoose.model('Quiz', quizSchema);
