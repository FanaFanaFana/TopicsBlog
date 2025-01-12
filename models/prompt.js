import { Schema, model, models } from 'mongoose';

const PromptSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    prompt: {
      type: String,
      required: [true, 'Prompt is required.'],
    },
    tag: {
      type: String,
      required: [true, 'Tag is required.'],
    },
    votes: {
      upvotes: { type: Number, default: 0 },
      downvotes: { type: Number, default: 0 },
      voters: [
        {
          userId: { type: Schema.Types.ObjectId, ref: 'User' },
          vote: { type: String, enum: ['up', 'down'] },
        },
      ],
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);


// Ensure a default votes object is created when a new prompt is initialized
PromptSchema.pre('save', function (next) {
  if (!this.votes) {
    this.votes = { upvotes: 0, downvotes: 0, voters: [] };
  }
  next();
});

const Prompt = models.Prompt || model('Prompt', PromptSchema);

export default Prompt;
