Todo App - React+Flask+Ariadne(GraphQL)+SQLAlchemy

Installation instructions:

Backend:

Pre-requisites:

Navigate to 'server' directory
Run 'pip3 install -r requirements.txt'. (Create a new virtual environment if necessary)
Keycloak: Create and run a keycloak docker instance. Refer: https://www.keycloak.org/getting-started/getting-started-docker

SQLAlchemy:

Navigate to 'server' directory and set flask app with 'export FLASK_APP=server.py'
Run 'flask db init'
Run 'flask db migrate'
Run 'flask db upgrade'
Flask:

Navigate to 'server' directory
Run 'python3 server.py'
Frontend:

Pre-requisites:

Navigate to 'client' directory
Run 'npm install'.
React:

Navigate to 'client' directory
Run 'npm start'
The app should be running on 'http://localhost:3000'.