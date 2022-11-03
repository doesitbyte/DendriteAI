Todo App - React+Flask+Ariadne(GraphQL)+SQLAlchemy

Installation instructions:

Backend:

Pre-requisites:
1. Navigate to 'server' directory
2. Run 'pip3 install -r requirements.txt'. (Create a new virtual environment if necessary)

Keycloak: 
1. Create and run a keycloak docker instance. Refer: https://www.keycloak.org/getting-started/getting-started-docker

SQLAlchemy:
1. Navigate to 'server' directory and set flask app with 'export FLASK_APP=server.py'
2. Run 'flask db init'
3. Run 'flask db migrate'
4. Run 'flask db upgrade'

Flask:
1. Navigate to 'server' directory
2. Run 'python3 server.py'

Frontend:

Pre-requisites:
1. Navigate to 'client' directory
2. Run 'npm install'.

React:
1. Navigate to 'client' directory
2. Run 'npm start'
3. The app should be running on 'http://localhost:3000'.
