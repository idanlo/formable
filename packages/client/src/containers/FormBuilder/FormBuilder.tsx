import React from 'react';
import styled from 'styled-components';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableLocation
} from 'react-beautiful-dnd';
import axios from 'axios';
import { List, Divider, Typography, Input, Button, Icon, Tabs } from 'antd';
import cloneDeep from 'lodash.clonedeep';
import { v4 as uuid } from 'uuid';
import { FormField, FormFieldTypes } from '@formable/shared';
import Field from './Field';
import FieldEditor from './FieldEditor';

type SelectedTabType = 'form' | 'design' | 'options';

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
  source: ToolbarItemType[],
  destination: FormField[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
): FormField[] => {
  const sourceClone = cloneDeep(source);
  const destClone = cloneDeep(destination);
  const item = sourceClone[droppableSource.index];

  const newItem: any = {
    type: item.value,
    id: uuid()
  };

  if (newItem.type === 'question') {
    newItem.question = {
      title: 'Question',
      description: 'Description',
      placeholder: ''
    };
  } else if (newItem.type === 'radio') {
    newItem.radio = {
      title: 'Radio',
      options: []
    };
  } else if (newItem.type === 'rating') {
    newItem.rating = {
      title: 'Rating',
      allowHalfStar: true
    };
  } else if (newItem.type === 'date') {
    newItem.date = {
      title: 'Date',
      type: 'date'
    };
  }

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

type ToolbarItemType = {
  value: FormFieldTypes;
  label: string;
  icon: string;
};

const toolbarItems: ToolbarItemType[] = [
  { value: 'question', label: 'Paragraph text', icon: 'file-text' },
  { value: 'radio', label: 'Multi choice', icon: 'check-circle' },
  // { value: 'number', label: 'Number field', icon: 'number' },
  { value: 'rating', label: 'Rating scale', icon: 'star' },
  // { value: 'file', label: 'File upload', icon: 'file' },
  { value: 'date', label: 'Date', icon: 'calendar' }
  // { value: 'phone', label: 'Phone number', icon: 'phone' },
  // { value: 'email', label: 'Email address', icon: 'mail' },
  // { value: 'link', label: 'Website', icon: 'link' },
  // { value: 'country', label: 'Country', icon: 'flag' }
];

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  background: #f0f1f6;
  /* padding-top: 20px; */
  padding-bottom: 20px;
`;

const Wrapper = styled.div`
  background: #f0f1f6;
  /* padding-top: 20px; */
  /* padding-bottom: 20px; */
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
  margin-left: 20px;
  padding-left: 20px;
`;

const Form = styled(Column)`
  flex: 0.55;
  flex-direction: column;
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

const FormBuilder: React.FC = () => {
  const [fields, setFields] = React.useState<FormField[]>([
    {
      type: 'question',
      id: uuid(),
      question: {
        title: 'Question',
        description: 'Description',
        placeholder: 'Placeholder'
      }
    }
  ]);
  const [selectFieldIndex, setSelectedFieldIndex] = React.useState<number>(0);
  const [selectedTab, setSelectedTab] = React.useState<SelectedTabType>('form');

  function onDragEnd(result: DropResult) {
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

  async function publishForm() {
    try {
      const res = await axios({
        url: '/api/form/create',
        method: 'POST',
        data: {
          title: 'Title',
          description: 'Description',
          fields
        }
      });
      console.log('Create form res -', res);
    } catch (err) {
      console.warn('Create form error -', err);
    }
  }

  function onTabChange(tab: string) {
    setSelectedTab(tab as SelectedTabType);
  }

  return (
    <Wrapper>
      <Tabs
        // style={{ padding: '0 10px' }}
        tabBarStyle={{ padding: '0 10px' }}
        activeKey={selectedTab}
        onChange={onTabChange}
        tabBarExtraContent={<Button onClick={publishForm}>Publish</Button>}
      >
        <Tabs.TabPane tab="Form" key="form">
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

                      <div style={{ display: 'none' }}>
                        {provided.placeholder}
                      </div>
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
        </Tabs.TabPane>
        <Tabs.TabPane tab="Design" key="design">
          <Container>
            <Form style={{ marginLeft: 20, flex: 1 }}>
              {fields.map((item, index) => (
                <Field
                  key={item.id}
                  field={item}
                  // isSelected={index === selectFieldIndex}
                  // select={() => setSelectedFieldIndex(index)}
                />
              ))}
            </Form>
            <Helper style={{ flex: 0.4 }}>
              <div>
                <p>Font</p>
                <Input type="text" />
              </div>
            </Helper>
          </Container>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Options" key="options">
          <Container>Options</Container>
        </Tabs.TabPane>
      </Tabs>
    </Wrapper>
  );
};

export default FormBuilder;
