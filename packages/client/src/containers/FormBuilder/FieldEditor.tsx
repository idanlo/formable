import React from 'react';
import { Select, Input, Checkbox, Button } from 'antd';
import cloneDeep from 'lodash.clonedeep';
import { FormField } from '@formable/shared';

type FieldEditorProps = {
  field: FormField;
  onEdit: (field: any) => any;
};

const FieldEditor: React.FC<FieldEditorProps> = ({ field, onEdit }) => {
  switch (field.type) {
    case 'question':
      return (
        <div>
          <p>Edit question title</p>
          <Input
            type="text"
            onChange={e => {
              const editable = cloneDeep(field);
              editable.question.title = e.target.value;
              onEdit(editable);
            }}
            value={field.question.title}
          />
          <p>Edit question description</p>
          <Input
            type="text"
            onChange={e => {
              const editable = cloneDeep(field);
              editable.question.description = e.target.value;
              onEdit(editable);
            }}
            value={field.question.description}
          />
          <p>Edit question placeholder</p>
          <Input
            type="text"
            onChange={e => {
              const editable = cloneDeep(field);
              editable.question.placeholder = e.target.value;
              onEdit(editable);
            }}
            value={field.question.placeholder}
          />
        </div>
      );
    case 'radio':
      return (
        <div>
          <p>Edit radio title</p>
          <Input
            type="text"
            onChange={e => {
              const editable = cloneDeep(field);
              editable.radio.title = e.target.value;
              onEdit(editable);
            }}
            value={field.radio.title}
          />
          <p>Add radio options</p>
          <form
            onSubmit={e => {
              e.preventDefault();
              const label = (e.currentTarget.childNodes[0] as HTMLInputElement)
                .value;
              const value = (e.currentTarget.childNodes[1] as HTMLInputElement)
                .value;
              const editable = cloneDeep(field);
              editable.radio.options = [
                ...editable.radio.options,
                { label, value }
              ];
              onEdit(editable);
            }}
          >
            <Input placeholder="Label" />
            <Input placeholder="Value" />
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          </form>
        </div>
      );
    case 'rating':
      return (
        <div>
          <p>Edit rating title</p>
          <Input
            type="text"
            onChange={e => {
              const editable = cloneDeep(field);
              editable.rating.title = e.target.value;
              onEdit(editable);
            }}
            value={field.rating.title}
          />
          <p>Allow half stars</p>
          <Checkbox
            checked={field.rating.allowHalfStar}
            onChange={() => {
              const editable = cloneDeep(field);
              editable.rating.allowHalfStar = !editable.rating.allowHalfStar;
              onEdit(editable);
            }}
          />
        </div>
      );

    case 'date':
      return (
        <div>
          <p>Edit title</p>
          <Input
            type="text"
            onChange={e => {
              const editable = cloneDeep(field);
              editable.date.title = e.target.value;
              onEdit(editable);
            }}
            value={field.date.title}
          />

          <p>Edit date picker type</p>
          <Select
            defaultValue="date"
            onChange={(val: 'date' | 'range' | 'date') => {
              const editable = cloneDeep(field);
              editable.date.type = val;
              onEdit(editable);
            }}
          >
            <Select.Option value="date">Date</Select.Option>
            <Select.Option value="range">Range</Select.Option>
            <Select.Option value="month">Month</Select.Option>
          </Select>
        </div>
      );
    default:
      return null;
  }
};

export default FieldEditor;
