# SimpleFoundation Application

## Overview

SimpleFoundation is an application designed to be modular and extensible. It includes dynamic loading of plugins, logging, and user authentication. The application supports various features such as plugin management, user management, and dynamic routing.

## Features

- **Dynamic Plugin Management**: Upload, activate, and deactivate plugins without restarting the server.
- **User Authentication**: Register, login, and manage users with different roles.
- **Logging**: Configurable logging system with support for different logging levels.
- **Dynamic Routing**: Load routes and middleware dynamically from plugins.

## Prerequisites

- Node.js (version 14 or later)
- npm (Node Package Manager)
- MongoDB

## Installation

1. **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Setup MongoDB**:
    Ensure MongoDB is installed and running. You can download and install MongoDB from [here](https://www.mongodb.com/try/download/community).

4. **Configuration**:
    Configure the application settings in the `config` directory.
    - `config/app.js`: Application settings.
    - `config/database.js`: Database connection settings.
    - `config/logging.js`: Logging settings.

    Example `config/app.js`:
    ```javascript
    const path = require('path');

    module.exports = {
      PORT: 3000,
      viewsDirectory: path.join(__dirname, '../views'),
      JWT_SECRET: 'your_secret_key',  // Replace with a strong secret key
    };
    ```

    Example `config/database.js`:
    ```javascript
    module.exports = {
      DATABASE_URL: 'mongodb://localhost:27017',
      DATABASE_NAME: 'pluginSystem'
    };
    ```

    Example `config/logging.js`:
    ```javascript
    const path = require('path');

    module.exports = {
      logFilePath: path.join(__dirname, '../logs/app.log'),
      logLevel: 'info',  // Possible values: 'none', 'debug', 'info', 'warn', 'error', 'fatal'
    };
    ```

5. **Run the application**:
    ```bash
    npm start
    ```

    The application will start and listen on the port specified in the configuration (default is `3000`).

## Usage

### Plugin Management

- **Upload Plugin**:
  - Endpoint: `POST /upload-plugin`
  - Description: Uploads a plugin zip file.
  - Form Data: `plugin` (file)

- **Activate Plugin**:
  - Endpoint: `POST /activate-plugin`
  - Description: Activates a plugin.
  - Body: `{ "pluginName": "pluginName" }`

- **Deactivate Plugin**:
  - Endpoint: `POST /deactivate-plugin`
  - Description: Deactivates a plugin.
  - Body: `{ "pluginName": "pluginName" }`

### User Authentication

- **Register User**:
  - Endpoint: `POST /register`
  - Description: Registers a new user.
  - Body: `{ "username": "user", "password": "password", "role": "role" }`

- **Login User**:
  - Endpoint: `POST /login`
  - Description: Logs in a user and returns a JWT token.
  - Body: `{ "username": "user", "password": "password" }`

- **Logout User**:
  - Endpoint: `POST /logout`
  - Description: Logs out the user by invalidating the token.
  - Body: `{}`

### Logging

- **Configure Logging**:
  - Edit `config/logging.js` to configure logging settings.
  - Example:
    ```javascript
    const path = require('path');

    module.exports = {
      logFilePath: path.join(__dirname, '../logs/app.log'),
      logLevel: 'info',  // Possible values: 'none', 'debug', 'info', 'warn', 'error', 'fatal'
    };
    ```

## Example Plugins

### User Manager Plugin

Provides user management functionalities such as creating and deleting users.

- **Routes**:
  - `POST /api/admin/create-user`: Creates a new user.
  - `DELETE /api/admin/delete-user`: Deletes a user.
  - `GET /admin/users`: Renders the user management page.
  - `GET /api/admin/users`: Lists all users.

### Auth Plugin

Handles user authentication including registration, login, and logout.

- **Routes**:
  - `GET /login`: Renders the login page.
  - `POST /login`: Handles user login.
  - `GET /register`: Renders the registration page.
  - `POST /register`: Handles user registration.
  - `POST /logout`: Handles user logout.

### Folder Structure

```
/middlewares
  /adminAuthMiddleware.js
/plugins
  /auth
    /middlewares
      /authMiddleware.js
    /handlers
      /auth.js
    /views
      /login.pug
      /register.pug
    /plugin.json
  /userManager
    /middlewares
      /adminAuthMiddleware.js
    /handlers
      /createAdminUser.js
      /deleteAdminUser.js
      /getAdminUsersPage.js
      /listAdminUsers.js
    /views
      /adminUsers.pug
    /plugin.json
/uploads
  /temp
/views
  /pluginManagement.pug
/config
  /app.js
  /database.js
  /logging.js
  /index.js
/utils
  /logger.js
app.js
uploadMiddleware.js
extractMiddleware.js
```
