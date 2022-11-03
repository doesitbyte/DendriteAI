"""
database.py

This file contains all the table initialization and functions for quering the SQL Database

"""

"""
Imports
"""

from flask_sqlalchemy import SQLAlchemy

"""
Initialize SQL Alchemy Database
"""

db = SQLAlchemy()


class Todo(db.Model):

    """
    Python class to represent an instance of the Todo table

    attributes:
    id -> Unique identifier for each Todo
    userId -> Unique identifier of the user who created the Todo
    title -> Title of the Todo
    description -> Description of the Todo
    dueDate -> Due date of the Todo
    completed -> If todo has been completed or not
    imageUrl -> Image associated with the Todo

    functions:
    to_json -> return a python dictionary representation of the Todo
    save -> insert Todo into table
    update -> update Todo as current state
    delete -> delete Todo from table
    """


    id = db.Column(db.Integer, primary_key=True)
    userId = db.Column(db.String(80))
    title = db.Column(db.String(80))
    description = db.Column(db.String(255))
    dueDate = db.Column(db.Date)
    completed = db.Column(db.Boolean, default=False)
    imageUrl = db.Column(db.String(255))

    def to_json(self):
        return {
            "id": self.id,
            "userId": self.userId,
            "title": self.title,
            "description": self.description,
            "dueDate": self.dueDate,
            "completed": self.completed,
            "imageUrl": self.imageUrl
        }

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


class User(db.Model):

    """
    Python class to represent an instance of the User table 

    attributes:
    id -> Unique identifier for each User
    username -> username of User as received from Keycloak
    premium -> check if user is a premium user

    functions:
    to_json -> return a python dictionary representation of the User
    save -> insert User into table
    update -> update User as current state
    delete -> delete User from table
    """

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80))
    premium = db.Column(db.Boolean, default=False)


    def to_json(self):
        return {
            "id": self.id,
            "username": self.username,
            "premium": self.premium
        }

    def save(self):
        db.session.add(self)
        db.session.commit()

    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

