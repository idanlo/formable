/* tslint-disable */
import React from 'react';
import styled from 'styled-components';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableLocation
} from 'react-beautiful-dnd';
import { List, Divider, Typography } from 'antd';

// a little function to help us with reordering the result
const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
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
  console.log('copy');
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const item = sourceClone[droppableSource.index];
  console.log('itemo', item);

  destClone.splice(droppableDestination.index, 0, item);
  return destClone;
};

const move = (
  source: any,
  destination: any,
  droppableSource: any,
  droppableDestination: any
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result: any = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const toolbarItems = [
  'Single line text',
  'Paragraph text',
  'Multi choice',
  'Number field',
  'separator',
  'Rating scale',
  'Yes / No',
  'File upload',
  'Date',
  'separator',
  'Phone number',
  'Email address',
  'Website',
  'Country'
];

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  background: #f0f1f6;
  height: calc(100vh - 75px);
  padding-top: 20px;
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
  /* padding: 0 20px; */
  padding-left: 20px;
`;

const Form = styled(Column)`
  flex: 0.55;
  padding: 0 20px;
`;

const Helper = styled(Column)`
  flex: 0.25;
  margin: 0 20px;
  padding: 0 20px;
`;

const ToolbarItem = styled(List.Item)`
  cursor: pointer;
  width: 100%;
  transition: background 0.2s;

  &:hover {
    background: #eee;
  }
`;

const Clone = styled(ToolbarItem)`
  + li {
    display: none !important;
  }
`;

const FormBuilder: React.FC = () => {
  const [fields, setFields] = React.useState<any[]>([]);

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
    } else if (source.droppableId === destination.droppableId) {
      const res = reorder(fields, source.index, destination.index);
      console.log('Reordered fields list', res);
      setFields(res);
    }
  }

  return (
    <Container>
      <DragDropContext
        onDragStart={() => console.log('SDARDASRAS ')}
        onDragEnd={onDragEnd}
      >
        <Toolbar>
          <Droppable droppableId="Toolbar" isDropDisabled>
            {(provided, snapshot) => (
              <div ref={provided.innerRef} style={{ width: '100%' }}>
                <List
                  size="large"
                  header={<Typography.Title>Toolbox</Typography.Title>}
                  style={{ width: '100%' }}
                  dataSource={toolbarItems}
                  renderItem={(item, index) =>
                    item === 'separator' ? (
                      <Divider />
                    ) : (
                      <Draggable key={item} draggableId={item} index={index}>
                        {(provided, snapshot) => (
                          <>
                            <div
                              ref={provided.innerRef as any}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={provided.draggableProps.style}
                            >
                              <ToolbarItem>{item}</ToolbarItem>
                            </div>
                            {snapshot.isDragging ? <Clone>{item}</Clone> : null}
                          </>
                        )}
                      </Draggable>
                    )
                  }
                />
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
                  border: snapshot.isDraggingOver
                    ? '1px dashed black'
                    : '1px solid black',
                  width: '100%',
                  height: '100%'
                }}
              >
                {fields.map((item, index) => (
                  <Draggable
                    key={index}
                    draggableId={index.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div ref={provided.innerRef} {...provided.draggableProps}>
                        <List.Item {...provided.dragHandleProps}>
                          {item}
                        </List.Item>
                      </div>
                    )}
                  </Draggable>
                ))}
              </div>
            )}
          </Droppable>
        </Form>
      </DragDropContext>
      <Helper>
        <h1>Selected field</h1>
        <p>Edit field</p>
      </Helper>
    </Container>
  );
};

export default FormBuilder;
