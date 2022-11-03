"""
model.py

This file contains all the resolvers for all graphql queries and mutations as described in schema.graphql

"""


"""
Imports
"""
from datetime import datetime
from ariadne import QueryType, MutationType
from database import Todo, User

"""
Initialize query and mutation from Ariadne
"""
query = QueryType()
mutation = MutationType()

@query.field("todos")
def todos(*_):

    """
    Query resolver to return all todos in Database
    """

    try:
        todos = [todo.to_json() for todo in Todo.query.all()]
        payload = {"success": True, "todos": todos}

    except Exception as e:
        payload = {"success": False, "errors": [str(e)]}

    return payload

@query.field("todo")
def todo(*_, id):

    """
    Query resolver to return one todo from Database
    """

    try:
        todo = Todo.query.filter_by(id=id).first()
        payload = {"success": True, "todo": todo}

    except Exception as e:
        payload = {"success": False, "errors": [str(e)]}

    return payload


@query.field("todos_user")
def user_todos(*_, userId):

    """
    Query resolver to return all todos of a particular user in Database
    """

    try:
        todos = [todo.to_json() for todo in Todo.query.filter_by(userId=userId)]
        payload = {"success": True, "todos": todos}

    except Exception as e:
        payload = {"success": False, "errors": [str(e)]}

    return payload


@mutation.field("add_todo")
def add_todo(_, info, userId, title, description, dueDate):

    """
    Mutation resolver to add a Todo into the Database
    """

    try:
        dueDate = datetime.strptime(dueDate, "%Y-%m-%d").date()
        todo = Todo(
            userId=userId, title=title, description=description, dueDate=dueDate
        )
        todo.save()
        payload = {"success": True, "todo": todo.to_json()}

    except Exception as e:
        payload = {
            "success": False,
            "errors": [
                f"Incorrect date format provided. Date should be in "
                f"the format dd-mm-yyyy"
            ],
        }

    return payload


@mutation.field("update_todo")
def update_todo(_, info, id, title, description, dueDate):

    """
    Mutation resolver to update a Todo in the Database
    """

    try:
        todo = Todo.query.filter_by(id=id).first()
        todo.title = title
        todo.description = description
        todo.dueDate = datetime.strptime(dueDate, "%Y-%m-%d").date()
        todo.update()
        payload = {"success": True, "todo": todo.to_json()}

    except Exception as e:
        payload = {"success": False, "errors": [str(e)]}

    return payload


@mutation.field("mark_done")
def mark_done(_, info, id, completed):

    """
    Mutation resolver to mark a Todo as done into the Database
    """

    try:
        todo = Todo.query.get(id)
        todo.completed = completed
        todo.update()
        payload = {
            "success": True,
            "todo": todo.to_json()
        }

    except Exception as e:
        payload = {
            "success": False,
            "errors":  [str(e)]
        }

    return payload


@mutation.field("delete_todo")
def delete_todo(_, info, id):

    """
    Mutation resolver to delete a Todo from the Database
    """

    try:
        todo = Todo.query.get(id)
        todo.delete()
        payload = {
            "success": True
        }

    except Exception as e:
        payload = {
            "success": False,
            "errors": [str(e)]
        }

    return payload


@query.field("user")
def user(*_, username):

    """
    Query resolver to get a User from the Database
    """

    try:
        user = User.query.filter_by(username=username).first()
        payload = {
            "success": True,
            "user": user.to_json()
        }
    except Exception as e:
        payload = {
            "success": False,
            "errors": [str(e)]
        }

    return payload


@mutation.field("add_user")
def add_user(*_, username):

    """
    Mutation resolver to add a User into the Database
    """

    try:
        user = User.query.filter_by(username=username).first()
        if not user:
            user = User(username=username)
            user.save()
        payload = {
            "success": True,
            "user": user
        }
    except Exception as e:
        payload = {
            "success": False,
            "errors": [str(e)]
        }

    return payload

@mutation.field("make_premium")
def make_premium(*_, username):

    """
    Mutation resolver to convert a User to Premium User in the Database
    """

    try:
        user = User.query.filter_by(username=username).first()
        user.premium = True
        user.update()
        payload = {
            "success": True,
            "user": user.to_json()
        }

    except Exception as e:
        payload = {
            "success": False,
            "errors":  [str(e)]
        }

    return payload
