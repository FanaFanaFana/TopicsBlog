import { Schema, model, models } from 'mongoose';

const CommentSchema = new Schema({
  promptId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Prompt', 
    required: true 
  },
  text: { 
    type: String, 
    required: [true, 'Comment text is required.'], 
    trim: true 
  },
  author: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  parentId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Comment', 
    default: null // null for top-level comments 
  },
  stance: { 
    type: String, 
    enum: ['pro', 'con', 'neutral'], 
    default: 'neutral' 
  }, // Add stance field
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date 
  },
  votes: {
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    voters: [{ userId: Schema.Types.ObjectId, vote: { type: String, enum: ['up', 'down'] } }]
  }
}, {
  timestamps: true
});


// Middleware to initialize votes object if not present
CommentSchema.pre('save', function (next) {
  if (!this.votes) {
    this.votes = { upvotes: 0, downvotes: 0, voters: [] };
  }
  
  if (this.isModified('text')) {
    this.updatedAt = new Date();
  }
  
  next();
});

// Virtual field to populate replies
CommentSchema.virtual('replies', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'parentId',
});

const Comment = models.Comment || model('Comment', CommentSchema);
export default Comment;
