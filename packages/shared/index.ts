export type FieldTypeRadio = {
  type: 'radio';
  radio: {
    title: string;
    options: Array<{ label: string; value: string }>;
  };
};

export type FieldTypeQuestion = {
  type: 'question';
  question: {
    title: string;
    description: string;
  };
};

export type FormField = FieldTypeRadio | FieldTypeQuestion;

export interface Form {
  title: string;
  description?: string;
  fields: [FormField];
}
