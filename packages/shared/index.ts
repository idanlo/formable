export type comparePasswordFunction = (
  candidatePassword: string,
  cb: (err: any, isMatch: any) => {}
) => void;

export interface AuthToken {
  accessToken: string;
  kind: string;
}

export interface User {
  email: string;
  password: string;
  passwordResetToken: string;
  passwordResetExpires: Date;

  facebook: string;
  tokens: AuthToken[];

  profile: {
    name: string;
    gender: string;
    location: string;
    website: string;
    picture: string;
  };

  comparePassword: comparePasswordFunction;
  gravatar: (size: number) => string;
}

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
    placeholder: string;
  };
};

export type FieldTypeRating = {
  type: 'rating';
  rating: {
    title: string;
    allowHalfStar: boolean;
  };
};

export type FieldTypeDate = {
  type: 'date';
  date: {
    title: string;
    type: 'date' | 'range' | 'month';
  };
};

export type FieldTypeQuestionAnswer = FieldTypeQuestion & {
  question: {
    value: string;
  };
};

export type FormField =
  | FieldTypeRadio
  | FieldTypeQuestion
  | FieldTypeRating
  | FieldTypeDate;

export interface Form {
  title: string;
  description?: string;
  fields: [FormField];
  owner: User;
}
