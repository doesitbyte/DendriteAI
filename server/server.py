"""
server.py

This file contains all the resolvers for all graphql queries and mutations as described in schema.graphql

"""
"""
Imports
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
import configparser
from ariadne.constants import PLAYGROUND_HTML
from ariadne import graphql_sync, make_executable_schema, gql, load_schema_from_path
from flask_migrate import Migrate
from model import query, mutation
from database import db

"""
Read Config
"""
config = configparser.ConfigParser()
config.read("./.config.ini")

"""
Get Keycloak Realm public key for JWT Validation
"""
public_key = config['REALM']['public_key']
jwk = """-----BEGIN PUBLIC KEY-----
{public_key}
-----END PUBLIC KEY-----""".format(public_key=public_key)

"""
Convert graphql schema to python executable schema
"""
type_defs = gql(load_schema_from_path("./schema.graphql"))
schema = make_executable_schema(type_defs, query, mutation)

"""
Initialize flask app
"""
app = Flask(__name__)
CORS(app)

"""
Configure DB
"""
app.config["SQLALCHEMY_DATABASE_URI"] = config['DATABASE']['db_url']
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)
migrate = Migrate(app, db)


def validateJWT(token):
   
   """
   Function to validate JWT token
   """

   try:
      decoded = jwt.decode(token, jwk, algorithms=["RS256"], audience=["account"], options={"verify_signature": True})
      return True
   except Exception as e:
      print(e)
      return False

@app.route("/graphql", methods=["GET"])
def graphql_playground():

   """
   Endpoint to render graphql playground for API testing. (Not needed in production)
   """

   return PLAYGROUND_HTML

@app.route("/graphql", methods=["POST"])
def graphql_server():

   """
   Endpoint to process all graphql requests
   """

   auth = request.headers['Authorization']
   valid = validateJWT(auth)
   if not valid:
      return jsonify({
         "data": "Invalid Authorization"
      })
   data = request.get_json()
   success, result = graphql_sync(schema, data, context_value={"request": request})
   status_code = 200 if success else 400
   return jsonify(result), status_code

if __name__ == "__main__":
   app.run()