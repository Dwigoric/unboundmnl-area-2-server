# UnboundMNL - Problem Area #2 (Server)
This is the server side of the UnboundMNL Problem Area #2.
The project presents a simple REST API, exposing endpoints for the client to use.
This is built using NodeJS and ExpressJS.

## Recommended: Install [Yarn Berry](https://yarnpkg.com/getting-started/install)
1. Install Node.js 14+
2. Open a terminal on your user directory.
3. Run `corepack enable`
4. Run `yarn set version stable`

## Environment Variables
Duplicate `.env.example` and rename it to `.env`.
### `PORT`
The port to use for the application, defaults to `3000`.
### `MONGODB_URI`
The MongoDB URI to use for the application, defaults to `mongodb://localhost:27017/unboundmnl-problem-area-2`.
### `JWT_SECRET`
The secret to use for JWT. This is required for the application to run.
If not set, the application will throw an error.
### `FRONTEND_URL`
The URL of the frontend application, defaults to `http://localhost:5173`.
This is used for CORS.

## Private Files
Put any private files in the `private` directory.
This route is protected by `.gitignore` and will not be committed to the repository.
Put here the template application form and other private files.

## Optional Development Stuff
### [Prettier](https://prettier.io/) for Code Formatting
You can install the [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extension (for VSCode).
Other editors have their own extensions as well.
Rules are already set in `.prettierrc.json`.

### [ESLint](https://eslint.org/) for Code Linting
You can install the [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extension (for VSCode).
Other editors have their own extensions as well.
Rules are already set in `.eslintrc.js`.

## Project Setup
```sh
yarn
```

### Start the Server
```sh
yarn start
```
