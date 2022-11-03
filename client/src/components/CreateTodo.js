import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { ADD_TODO, UPDATE_TODO, GET_ONE_TODO } from "../graphql/Queries";

{/* 
  Component to render create Todo Form
*/}

const CreateTodo = (props) => {
  const [todo, setTodo] = useState({
    userId: props.username,
    title: "",
    description: "",
    dueDate: "",
  });

  const [addTodo, { loading, error, data }] = useMutation(ADD_TODO);

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.formFile.value);
    addTodo({
      variables: {
        userId: todo.userId,
        title: todo.title,
        description: todo.description,
        dueDate: todo.dueDate,
      },
    }).then((addResult) => {
      props.refresh();
    });
  };

  return (
    <>
      <h2>Create To Do</h2>
      <Form onSubmit={onSubmit}>
        <Form.Group
          className="mb-3"
          controlId="allTodoTitle"
          onChange={(e) => setTodo({ ...todo, title: e.target.value })}
        >
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" placeholder="Title" />
        </Form.Group>

        <Form.Group
          className="mb-3"
          controlId="allTodoDescription"
          onChange={(e) => setTodo({ ...todo, description: e.target.value })}
        >
          <Form.Label>Description</Form.Label>
          <Form.Control type="text" placeholder="Description" />
        </Form.Group>

        <Form.Group
          className="mb-3"
          controlId="allTodoDueDate"
          onChange={(e) => setTodo({ ...todo, dueDate: e.target.value })}
        >
          <Form.Label>Date</Form.Label>
          <Form.Control type="date" name="dueDate" />
        </Form.Group>

        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="file"
            accept="image/png, image/jpeg"
            disabled={props.premium ? "" : "disabled"}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};


{/* 
  Component to render update Todo Form
*/}

const UpdateTodo = (props) => {
  console.log(props.id);
  const [todo, setTodo] = useState({
    userId: props.username,
    title: "",
    description: "",
    dueDate: "",
  });

  const [getOneTodo, { loading, error, data, refetch }] =
    useLazyQuery(GET_ONE_TODO);

  useEffect(() => {
    getOneTodo({
      variables: {
        id: props.id,
      },
    });
  }, []);
  const [updateTodo, { loadingUpdate, errorUpdate, dataUpdate }] =
    useMutation(UPDATE_TODO);

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.formFile.value);
    const title = e.target.allTodoTitle.value;
    const description = e.target.allTodoDescription.value;
    const dueDate = e.target.allTodoDueDate.value;
    console.log(title, description, dueDate);
    updateTodo({
      variables: {
        id: props.id,
        title: title,
        description: description,
        dueDate: dueDate,
      },
    }).then((addResult) => {
      props.refresh();
    });
  };

  if (loading) return <h1>LOADING</h1>;
  if (error) return <h1>{error}</h1>;

  if (data) {
    console.log(data);
    return (
      <>
        <h1>Update To Do</h1>
        <Form onSubmit={onSubmit}>
          <Form.Group
            className="mb-3"
            controlId="allTodoTitle"
            //   onChange={(e) => setTodo({ ...todo, title: e.target.value })}
          >
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Title"
              defaultValue={data.todo.todo.title}
            />
          </Form.Group>

          <Form.Group
            className="mb-3"
            controlId="allTodoDescription"
            //   onChange={(e) => setTodo({ ...todo, description: e.target.value })}
          >
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Description"
              defaultValue={data.todo.todo.description}
            />
          </Form.Group>

          <Form.Group
            className="mb-3"
            controlId="allTodoDueDate"
            //   onChange={(e) => setTodo({ ...todo, dueDate: e.target.value })}
          >
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              name="dueDate"
              defaultValue={data.todo.todo.dueDate}
            />
          </Form.Group>

          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/png, image/jpeg"
              disabled={props.premium ? "" : "disabled"}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </>
    );
  }
};

export { CreateTodo, UpdateTodo };
