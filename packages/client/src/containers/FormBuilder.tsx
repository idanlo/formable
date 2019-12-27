import React from 'react';
import styled from 'styled-components';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableLocation
} from 'react-beautiful-dnd';
import {
  List,
  Divider,
  Typography,
  Input,
  Radio,
  Button,
  Rate,
  Checkbox,
  Icon,
  DatePicker,
  Select
} from 'antd';
import cloneDeep from 'lodash.clonedeep';
import { FormField } from '@formable/shared';

// a little function to help us with reordering the result
const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = cloneDeep(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const copy = (
  source: any[],
  destination: any[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
) => {
  const sourceClone = cloneDeep(source);
  const destClone = cloneDeep(destination);
  const item = sourceClone[droppableSource.index];
  console.log('item', item);

  const newItem: any = {
    type: item.value,
    question:
      item.value === 'question'
        ? {
            title: 'Question',
            description: 'Description'
          }
        : undefined,
    radio:
      item.value === 'radio'
        ? {
            title: 'Radio',
            options: []
          }
        : undefined,
    rating:
      item.value === 'rating'
        ? {
            title: 'Rating',
            allowHalfStar: true
          }
        : undefined,
    date:
      item.value === 'date'
        ? {
            title: 'Date',
            type: 'date'
          }
        : undefined
  };

  destClone.splice(droppableDestination.index, 0, { ...newItem });
  return destClone;
};

// const move = (
//   source: any,
//   destination: any,
//   droppableSource: any,
//   droppableDestination: any
// ) => {
//   const sourceClone = Array.from(source);
//   const destClone = Array.from(destination);
//   const [removed] = sourceClone.splice(droppableSource.index, 1);

//   destClone.splice(droppableDestination.index, 0, removed);

//   const result: any = {};
//   result[droppableSource.droppableId] = sourceClone;
//   result[droppableDestination.droppableId] = destClone;

//   return result;
// };

const toolbarItems = [
  { value: 'question', label: 'Paragraph text', icon: 'file-text' },
  { value: 'radio', label: 'Multi choice', icon: 'check-circle' },
  { value: 'number', label: 'Number field', icon: 'number' },
  { value: 'rating', label: 'Rating scale', icon: 'star' },
  { value: 'file', label: 'File upload', icon: 'file' },
  { value: 'date', label: 'Date', icon: 'calendar' },
  { value: 'phone', label: 'Phone number', icon: 'phone' },
  { value: 'email', label: 'Email address', icon: 'mail' },
  { value: 'link', label: 'Website', icon: 'link' },
  { value: 'country', label: 'Country', icon: 'flag' }
];

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  background: #f0f1f6;
  padding-top: 20px;
  padding-bottom: 20px;
`;

const Column = styled.div`
  display: flex;
  background: #fff;
  border-radius: 5px;
  box-shadow: 3px 3px 14px 0px rgba(196, 196, 196, 0.7);
`;

const Toolbar = styled(Column)`
  flex: 0.2;
  margin-right: 20px;
  height: 100%;
  /* padding: 0 20px; */
  padding-left: 20px;
`;

const Form = styled(Column)`
  flex: 0.55;
`;

const FieldWrapper = styled.div<{ isSelected: boolean }>`
  border-left: 0px solid #4c75ec;
  border-left-width: ${({ isSelected }) => (isSelected ? '4px' : '')};
  border-radius: 3px;
  transition: border-left-width 0.2s;
  padding: 10px 20px;
`;

const Helper = styled(Column)`
  flex-direction: column;
  flex: 0.25;
  margin: 0 20px;
  padding: 0 20px;
  height: 100%;
`;

const ToolbarItem = styled(List.Item)`
  cursor: pointer;
  width: 100%;
  padding: 0;
  transition: background 0.2s;

  && {
    display: flex;
    flex: 1;
    align-items: center;
  }

  &:hover {
    background: #eee;
  }
`;

const Clone = styled(ToolbarItem)`
  border-bottom: none !important;
`;

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
            onChange={(val: 'date' | 'range' | 'month') => {
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

type FieldProps = {
  field: FormField;
  isSelected: boolean;
  select: () => void;
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

const FormBuilder: React.FC = () => {
  const [fields, setFields] = React.useState<FormField[]>([
    {
      type: 'question',
      question: {
        title: 'Question',
        description: 'Description',
        placeholder: 'Placeholder'
      }
    }
  ]);
  const [selectFieldIndex, setSelectedFieldIndex] = React.useState<number>(0);

  function onDragEnd(result: DropResult) {
    console.log('Drag result -', result);
    const { source, destination } = result;

    if (!destination) {
      return;
    }
    if (source.droppableId === 'Toolbar') {
      const res = copy(toolbarItems, fields, source, destination);
      console.log('New fields list', res);
      setFields(res);
      setSelectedFieldIndex(destination.index);
    } else if (source.droppableId === destination.droppableId) {
      const res = reorder(fields, source.index, destination.index);
      console.log('Reordered fields list', res);
      setFields(res);
    }
  }

  return (
    <Container>
      <DragDropContext onDragEnd={onDragEnd}>
        <Toolbar>
          <Droppable droppableId="Toolbar" isDropDisabled>
            {(provided, snapshot) => (
              <div ref={provided.innerRef} style={{ flex: 1 }}>
                <List
                  size="large"
                  header={<Typography.Title>Toolbox</Typography.Title>}
                  style={{ flex: 1 }}
                  dataSource={toolbarItems}
                  renderItem={(item, index) => (
                    <Draggable
                      key={item.value}
                      draggableId={item.value}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <>
                          <div ref={provided.innerRef as any}>
                            <ToolbarItem
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={provided.draggableProps.style}
                            >
                              <Icon
                                type={item.icon}
                                theme="outlined"
                                style={{
                                  color: '#4C75EC',
                                  fontSize: 20,
                                  paddingRight: 5
                                }}
                              />
                              {item.label}
                            </ToolbarItem>
                          </div>

                          {snapshot.isDragging ? (
                            <Clone className="react-beautiful-dnd-copy">
                              <Icon
                                type={item.icon}
                                theme="outlined"
                                style={{
                                  color: '#4C75EC',
                                  fontSize: 20,
                                  paddingRight: 5
                                }}
                              />
                              {item.label}
                            </Clone>
                          ) : null}
                        </>
                      )}
                    </Draggable>
                  )}
                />

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Toolbar>
        <Form>
          <Droppable droppableId="Form">
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={{
                  // width: '100%',
                  // height: '100%',
                  flex: 1
                }}
              >
                {fields.map((item, index) => (
                  <Draggable
                    key={index}
                    draggableId={index.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                      >
                        <Field
                          field={item}
                          isSelected={index === selectFieldIndex}
                          select={() => setSelectedFieldIndex(index)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Form>
      </DragDropContext>
      <Helper>
        <h1>Selected field: {fields[selectFieldIndex].type}</h1>
        <FieldEditor
          field={fields[selectFieldIndex]}
          onEdit={(field: any) => {
            setFields(
              fields.map((item: FormField, i: number) => {
                if (selectFieldIndex === i) {
                  return field;
                }
                return item;
              })
            );
          }}
        />
        <Divider />
      </Helper>
    </Container>
  );
};

export default FormBuilder;
