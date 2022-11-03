{/* 
  Component to render Todo List
*/}

import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { GET_USER_TODOS, DELETE_TODO, MARK_DONE } from "../graphql/Queries";

const ListTodo = (props) => {
  const { loading, error, data, refetch } = useQuery(GET_USER_TODOS, {
    variables: {
      userId: props.username,
    },
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
  });

  refetch({
    userId: props.username,
  });

  const [delete_todo, { dataDelete, loadingDelete, errorDelete }] =
    useMutation(DELETE_TODO);

  const [mark_done, { dataMarkDone, loadingMarkDone, errorMarkDone }] =
    useMutation(MARK_DONE);

  const resolveDeleteTodo = (id) => {
    // Function to handle Todo deletetion
    delete_todo({
      variables: {
        id: id,
      },
    }).then((returnValue) => {
      if (loading) console.log("Loading...");
      if (error) console.log(error.message);
      if (data) {
        refetch({
          userId: props.username,
        });
      }
    });
  };

  const resolveMarkDone = (id, completed) => {
    // Function to handle marking Todo completion status
    mark_done({
      variables: {
        id: id,
        completed: completed,
      },
    }).then((returnValue) => {
      refetch({
        userId: props.username,
      });
    });
  };

  const resolveUpdateId = (id) => {
    // Function to trigger Todo Update
    props.updateIdToggle(id)
  }

  if (loading) return <h1>LOADING...</h1>;
  if (error) return <h1>{error}</h1>;
  console.log(data.todos_user.todos);
  return (
    <div>
        <h2>Your To Do List</h2>
      {data.todos_user.todos.length == 0 && <h1>No tasks added</h1>}
      {data.todos_user.todos.map(
        ({ id, title, description, dueDate, completed }) => (
          <Card
            className="mb-2"
            style={{
              width: "80%",
              margin: "auto",

            }}
            bg={"light"}
            key={id}
            text={"dark"}
          >
            {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
            <Card.Body>
              <Card.Title>{title}</Card.Title>
              <Card.Text>{description}</Card.Text>
              <Card.Text>{dueDate}</Card.Text>
              <Form.Check
                type="switch"
                label={completed? "Completed!": "Pending"}
                checked={completed && true}
                onChange={(e) => {
                  if (e.target.checked != completed) {
                    resolveMarkDone(id, e.target.checked);
                  }
                }}
              />

              <Button
                variant="primary"
                onClick={() => {
                  resolveUpdateId(id);
                }}
              >
                Update
              </Button>
              <Button
              style={{
                margin: "1rem"
              }}
                variant="warning"
                onClick={() => {
                  resolveDeleteTodo(id);
                }}
              >
                Delete
              </Button>
            </Card.Body>
          </Card>
        )
      )}
    </div>
  );
};

export default ListTodo;
