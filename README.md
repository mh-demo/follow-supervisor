# Follow Supervisor

**Project status**: Prototype

This application serves as a demonstration of the 'Follow-Supervisor' functionality for the proposed LightFeather management system.

# Dependencies

Install the following software on your development machine first:

- **git** - https://git-scm.com/downloads
- **node/npm** - https://nodejs.org/en/download/
- **docker** - https://docs.docker.com/get-docker/
- **vscode** - https://code.visualstudio.com/
  - Also install vscode extensions: ESLint, Prettier

# Installation

Be sure to install the dependencies (above) before installation. Then clone the source code from this repository and open the working directory in a terminal.

Next, install node modules:

```sh
npm install
```

# Configuration

Environment variables can be configured before launch. These variables control interaction with third party resources. Sensible fallback values already exist, so this step can be skipped.
- Copy the `.env.local.example` file and name it `.env.local`. Modify the `.env.local` file to specify the values.

# Usage

Once your development environment is configured, you can run the command below to host the application locally.

```sh
npm run dev
```

The web application can then be viewed in your browser by visiting:


- http://localhost:3000


This application exposes 2 peer API endpoints as well:


- http://localhost:3000/api/supervisors (GET)
- http://localhost:3000/api/submit (POST)

# Build

This package has been dockerized.  In order to build the container, run the following command:

```sh
docker-compose build
```

Once the container has been built, it can be launched using:

```sh
docker-compose up
```

If you wish to include modified environment variables, be sure to include the name of your .env file as a parameter:

```sh
docker-compose --env-file .env.local up
```