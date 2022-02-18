Trustnet-Client
=

Trustnet-Client is a client written in Vue that connects to [Trustnet-Backend](https://github.com/farnazj/Trustnet-Backend).

### Setup Instructions

#### Install Git and clone this repository
* `git clone https://github.com/farnazj/Trustnet-Client`

#### Install Node Module Dependencies
cd to the root directory of the project where package.json is. Run:
* `npm install`

#### Specify the Backend
Specify the URL of the backend that this client connects to in './src/services/constants.js'

#### Compile with hot-reloads for development
In the root directory of the project run:
* `npm run serve`

#### Compile and minify for production
* `npm run build`
