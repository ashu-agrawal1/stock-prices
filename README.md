## For Client side app

In the project directory, navigate to frontend folder:
### `cd frontend`

To install the dependencies
### `npm install`

Please add .env file in the frontend folder and add these variables

REACT_APP_BACKEND_URL = backend url, default value is : "http://localhost:8080"
REACT_APP_SOCKET_URL = websocket url, default value is : "ws://localhost:8080"

ignoring the .env file would run the app with default values

To run the client app
### `npm run start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.


## For Server side app

In the project directory, navigate to backend folder:
### `cd backend`

To install the dependencies
### `npm install`

Please add .env file in the backend folder and add these variables

MONGO_URI = mongodb url, default value is : 'mongodb://localhost:27017/cryptoDB'
PORT = port to run the server, default value is : 8080
POLL_INTERVAL = Time interval to fetch stock data from API (in miliseconds), default value is : 30000

Note: please do not set POLL_INTERVAL too low, because the free API might not support so many API requests

ignoring the .env file would run the app with default values

To run the server
### `npm run start`
