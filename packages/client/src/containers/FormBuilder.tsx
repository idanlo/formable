/* tslint-disable */
import React from "react";
import styled from "styled-components";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableLocation
} from "react-beautiful-dnd";
import {
  List,
  Divider,
  Typography,
  Input,
  Radio,
  Button,
  Rate,
  Checkbox
} from "antd";
import cloneDeep from "lodash.clonedeep";
import { FormField } from "@formable/shared";

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
  console.log("copy");
  const sourceClone = cloneDeep(source);
  const destClone = cloneDeep(destination);
  const item = sourceClone[droppableSource.index];
  console.log("itemo", item);

  const newItem = {
    type: item.value,
    question:
      item.value === "question"
        ? {
            title: "Question",
            description: "Description"
          }
        : undefined,
    radio:
      item.value === "radio"
        ? {
            title: "Radio",
            options: []
          }
        : null,
    rating:
      item.value === "rating"
        ? {
            title: "Rating",
            allowHalfStar: true
          }
        : null,
    link:
      item.value === "link"
        ? {
            title: "Website"
          }
        : null
  };

  destClone.splice(droppableDestination.index, 0, { ...newItem });
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
  { value: "question", label: "Paragraph text" },
  { value: "radio", label: "Multi choice" },
  { value: "number", label: "Number field" },
  { value: "separator", label: "separator" },
  { value: "rating", label: "Rating scale" },
  { value: "yesno", label: "Yes / No" },
  { value: "file", label: "File upload" },
  { value: "date", label: "Date" },
  { value: "separator", label: "separator" },
  { value: "phone", label: "Phone number" },
  { value: "email", label: "Email address" },
  { value: "link", label: "Website" },
  { value: "country", label: "Country" }
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
  padding: 0 20px;
`;

const FieldWrapper = styled.div<{ isSelected: boolean }>`
  background: ${({ isSelected }) => (isSelected ? "#ccc" : "")};
  transition: background 0.2s;
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
  transition: background 0.2s;
  transform: ${(props: { isDragging: boolean }) =>
    !props.isDragging ? "none !important" : ""};

  &:hover {
    background: #eee;
  }
`;

const Clone = styled(ToolbarItem)`
  border-bottom: none !important;
`;

type FieldEditorProps = {
  field: any;
  onEdit: (field: any) => any;
};

const FieldEditor: React.FC<FieldEditorProps> = ({ field, onEdit }) => {
  switch (field.type) {
    case "question":
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
    case "radio":
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
    case "rating":
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
    case "link":
      return (
        <div>
          <p>Edit link title</p>
          <Input
            type="text"
            placeholder="Link title"
            value={field.link.title}
            onChange={e => {
              const editable = cloneDeep(field);
              editable.link.title = e.target.value;
              onEdit(editable);
            }}
          />
        </div>
      );
    default:
      return null;
  }
};

type FieldProps = {
  field: any;
  isSelected: boolean;
  select: () => void;
};

const Field: React.FC<FieldProps> = ({ field, isSelected, select }) => {
  switch (field.type) {
    case "question":
      return (
        <FieldWrapper onClick={select} isSelected={isSelected}>
          <h1>{field.question.title}</h1>
          <p>{field.question.description}</p>
          <Input type="text" placeholder={field.question.placeholder} />
        </FieldWrapper>
      );
    case "radio":
      return (
        <FieldWrapper onClick={select} isSelected={isSelected}>
          <h1>{field.radio.title}</h1>
          <fieldset>
            <Radio.Group>
              {field.radio.options.map((opt: any) => (
                <Radio
                  style={{ display: "block", lineHeight: "20pt" }}
                  value={opt.value}
                >
                  {opt.label}
                </Radio>
              ))}
            </Radio.Group>
          </fieldset>
        </FieldWrapper>
      );
    case "rating":
      return (
        <FieldWrapper onClick={select} isSelected={isSelected}>
          <h1>{field.rating.title}</h1>
          <Rate allowHalf={field.rating.allowHalfStar} defaultValue={2} />
        </FieldWrapper>
      );
    case "link":
      return (
        <FieldWrapper onClick={select} isSelected={isSelected}>
          <h1>{field.link.title}</h1>
          <Input addonBefore="https://" />
        </FieldWrapper>
      );
    default:
      return null;
  }
};

const FormBuilder: React.FC = () => {
  const [fields, setFields] = React.useState<any[]>([
    {
      type: "question",
      question: {
        title: "Question",
        description: "Description"
      }
    }
  ]);
  const [selectFieldIndex, setSelectedFieldIndex] = React.useState<number>(0);

  function onDragEnd(result: DropResult) {
    console.log("Drag result -", result);
    const { source, destination } = result;

    if (!destination) {
      return;
    }
    if (source.droppableId === "Toolbar") {
      const res = copy(toolbarItems, fields, source, destination);
      console.log("New fields list", res);
      setFields(res);
      setSelectedFieldIndex(destination.index);
    } else if (source.droppableId === destination.droppableId) {
      const res = reorder(fields, source.index, destination.index);
      console.log("Reordered fields list", res);
      setFields(res);
    }
  }

  return (
    <Container>
      <DragDropContext onDragEnd={onDragEnd}>
        <Toolbar>
          <Droppable droppableId="Toolbar" isDropDisabled>
            {(provided, snapshot) => (
              <div ref={provided.innerRef} style={{ width: "100%" }}>
                <List
                  size="large"
                  header={<Typography.Title>Toolbox</Typography.Title>}
                  style={{ width: "100%" }}
                  dataSource={toolbarItems}
                  renderItem={(item, index) =>
                    item.value === "separator" ? (
                      <Divider key={index} style={{ margin: "5px 0" }} />
                    ) : (
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
                                isDragging={snapshot.isDragging}
                              >
                                {item.label}
                              </ToolbarItem>
                            </div>
                            {snapshot.isDragging ? (
                              <Clone isDragging={false}>{item.label}</Clone>
                            ) : null}
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
                  width: "100%",
                  height: "100%",
                  padding: 20
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
              fields.map((item, i) => {
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
