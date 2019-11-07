import mongoose from 'mongoose';

export type FormDocument = mongoose.Document & {
  title: string;
};

export type FieldTypeQuestion = {
  type: 'question';
  question: {
    title: string;
    description: string;
  };
};

export type FieldTypeRadio = {
  type: 'radio';
  radio: {
    title: string;
    options: Array<{ label: string; value: string }>;
  };
};

export type Field = mongoose.Document & (FieldTypeQuestion | FieldTypeRadio);

const fieldSchema = new mongoose.Schema({});

const formSchema = new mongoose.Schema(
  {
    title: String,
    fields: [fieldSchema]
  },
  { timestamps: true }
);

export const Form = mongoose.model<FormDocument>('Form', formSchema);
