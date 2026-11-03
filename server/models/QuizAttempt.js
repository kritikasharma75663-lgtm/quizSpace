const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true,
    },
    selectedOption: {
      type: Number, // 0, 1, 2, 3 or null if unanswered
      default: null,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

// Immutable snapshot preserved at attempt time / submission
const snapshotItemSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    questionText: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
    },
    correctAnswer: {
      type: Number,
      required: true,
    },
    explanation: {
      type: String,
      default: '',
    },
    selectedOption: {
      type: Number,
      default: null,
    },
    isCorrect: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const quizAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Attempt must belong to a user'],
      index: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz',
      required: [true, 'Attempt must belong to a quiz'],
      index: true,
    },
    startedAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['In Progress', 'Completed', 'Expired'],
      default: 'In Progress',
      index: true,
    },
    answers: [answerSchema],
    snapshot: [snapshotItemSchema],
    score: {
      type: Number,
      default: 0,
    },
    totalMarks: {
      type: Number,
      default: 0,
    },
    correctCount: {
      type: Number,
      default: 0,
    },
    incorrectCount: {
      type: Number,
      default: 0,
    },
    unansweredCount: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    timeTaken: {
      type: Number, // in seconds
      default: 0,
    },
    passed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for querying user's recent attempts
quizAttemptSchema.index({ user: 1, createdAt: -1 });
quizAttemptSchema.index({ quiz: 1, createdAt: -1 });
quizAttemptSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('QuizAttempt', quizAttemptSchema);
