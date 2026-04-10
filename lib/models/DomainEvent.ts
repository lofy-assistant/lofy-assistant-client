import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IDomainEvent extends Document {
  event_id: string;
  event_type: string;
  user_id: string;
  data: Record<string, unknown>;
  event_metadata: Record<string, unknown>;
  created_at: Date;
}

const DomainEventSchema = new Schema<IDomainEvent>(
  {
    event_id: {
      type: String,
      required: true,
      index: true,
    },
    event_type: {
      type: String,
      required: true,
      index: true,
    },
    user_id: {
      type: String,
      required: true,
      index: true,
    },
    data: {
      type: Schema.Types.Mixed,
      default: {},
    },
    event_metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    created_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    collection: 'domain_events',
    versionKey: false,
  }
);

const DomainEvent: Model<IDomainEvent> =
  mongoose.models.DomainEvent || mongoose.model<IDomainEvent>('DomainEvent', DomainEventSchema);

export default DomainEvent;