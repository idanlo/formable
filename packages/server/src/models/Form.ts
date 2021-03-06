import mongoose from 'mongoose';
import { Form as FormDocument } from '@formable/shared';

const fieldTypeQuestionSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    placeholder: String
  },
  { _id: false }
);

const radioOptionSchema = new mongoose.Schema(
  {
    label: { required: true, type: String },
    value: { required: true, type: String }
  },
  { _id: false }
);

const fieldTypeRadioSchema = new mongoose.Schema(
  {
    title: String,
    options: [radioOptionSchema]
  },
  { _id: false }
);

const fieldTypeRatingSchema = new mongoose.Schema(
  {
    title: String,
    allowHalfStar: { required: false, type: Boolean, default: true }
  },
  { _id: false }
);

const fieldTypeDateSchema = new mongoose.Schema(
  {
    title: String,
    type: { required: false, type: String, default: 'date' }
  },
  { _id: false }
);

const fieldSchema = new mongoose.Schema(
  {
    required: { required: false, type: Boolean, default: false },
    id: { required: true, type: String }
  },
  { discriminatorKey: 'type', _id: false }
);

const formSchema = new mongoose.Schema(
  {
    title: { required: true, type: String },
    description: String,
    fields: [fieldSchema],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

(formSchema.path('fields') as any).discriminator(
  'question',
  new mongoose.Schema(
    { question: { required: true, type: fieldTypeQuestionSchema } },
    { _id: false }
  )
);

(formSchema.path('fields') as any).discriminator(
  'radio',
  new mongoose.Schema(
    { radio: { required: true, type: fieldTypeRadioSchema } },
    { _id: false }
  )
);

(formSchema.path('fields') as any).discriminator(
  'rating',
  new mongoose.Schema(
    { rating: { required: true, type: fieldTypeRatingSchema } },
    { _id: false }
  )
);

(formSchema.path('fields') as any).discriminator(
  'date',
  new mongoose.Schema(
    { date: { required: true, type: fieldTypeDateSchema } },
    { _id: false }
  )
);

export const Form = mongoose.model<FormDocument & mongoose.Document>(
  'Form',
  formSchema
);
