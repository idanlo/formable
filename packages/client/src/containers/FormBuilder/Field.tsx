import React from 'react';
import styled from 'styled-components';
import { Input, Radio, DatePicker, Rate } from 'antd';
import { FormField } from '@formable/shared';

const FieldWrapper = styled.div<{ isSelected?: boolean }>`
  border-left: 0px solid #4c75ec;
  border-left-width: ${({ isSelected }) => (isSelected ? '4px' : '')};
  border-radius: 3px;
  transition: border-left-width 0.2s;
  padding: 10px 20px;
`;

type FieldProps = {
  field: FormField;
  isSelected?: boolean;
  select?: () => void;
};

const Field: React.FC<FieldProps> = ({ field, isSelected, select }) => {
  switch (field.type) {
    case 'question':
      return (
        <FieldWrapper onClick={select} isSelected={isSelected}>
          <h1>{field.question.title}</h1>
          <p>{field.question.description}</p>
          <Input type="text" placeholder={field.question.placeholder} />
        </FieldWrapper>
      );
    case 'radio':
      return (
        <FieldWrapper onClick={select} isSelected={isSelected}>
          <h1>{field.radio.title}</h1>
          <fieldset>
            <Radio.Group>
              {field.radio.options.map((opt: any) => (
                <Radio
                  style={{ display: 'block', lineHeight: '20pt' }}
                  value={opt.value}
                >
                  {opt.label}
                </Radio>
              ))}
            </Radio.Group>
          </fieldset>
        </FieldWrapper>
      );
    case 'rating':
      return (
        <FieldWrapper onClick={select} isSelected={isSelected}>
          <h1>{field.rating.title}</h1>
          <Rate allowHalf={field.rating.allowHalfStar} defaultValue={2} />
        </FieldWrapper>
      );
    case 'date':
      let picker = null;
      if (field.date.type === 'date') {
        picker = <DatePicker />;
      } else if (field.date.type === 'range') {
        picker = <DatePicker.RangePicker />;
      } else if (field.date.type === 'month') {
        picker = <DatePicker.MonthPicker />;
      }
      return (
        <FieldWrapper onClick={select} isSelected={isSelected}>
          <h1>{field.date.title}</h1>
          {picker}
        </FieldWrapper>
      );
    default:
      return null;
  }
};

export default Field;
