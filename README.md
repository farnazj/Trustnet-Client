TrustNetClient
=

TrustNetClient is a client written in Vue that connects to [TrustnetBackend](https://github.com/farnazj/TrustNetBackend).

### Setup Instructions

#### Install Git and clone this repository
* `git clone https://github.com/farnazj/TrustNetClient`

#### Install Node Module Dependencies
cd to the root directory of the project where package.json is. Run:
* `npm install`

#### Specify the Backend
Specify the URL of the backend that this client connects to in './src/services/constants'

#### Compile with hot-reloads for development
In the root directory of the project run:
* `npm run serve`

#### Compile and minify for production
* `npm run build`
