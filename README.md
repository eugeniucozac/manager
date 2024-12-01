# Task Project Manager

Task-Project Manager is a RESTful API designed for managing tasks and projects efficiently. It allows users to create, update, delete, and retrieve tasks and projects with features like validation, sorting, filtering, and error handling.

---

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Getting Started](#getting-started)
4. [API Endpoints](#api-endpoints)
   - [Tasks](#tasks)
   - [Projects](#projects)
5. [Validation](#validation)
6. [Error Handling](#error-handling)
7. [Project Structure](#project-structure)
8. [Contributing](#contributing)
9. [License](#license)

---

## Features

- **CRUD Operations**:
  - Create, read, update, and delete tasks and projects.
- **Validation**:
  - Ensures data integrity using `zod`.
- **Sorting and Filtering**:
  - Sort tasks/projects by various fields.
  - Filter tasks by project or status.
- **Advanced Error Handling**:
  - Custom error messages for validation and unexpected issues.
- **Security**:
  - Implements `helmet` for basic security headers.
  - Rate limiting using `express-rate-limit`.
- **Logging**:
  - Logs requests and errors using `winston`.

---

## Technologies Used

- **Node.js**
- **Express.js**: For building the API.
- **TypeScript**: For type safety.
- **MongoDB**: Database to store tasks and projects.
- **Zod**: For request validation.
- **Winston**: For structured logging.
- **Helmet**: For security headers.
- **Rate Limiting**: To prevent excessive API usage.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- [MongoDB](https://www.mongodb.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/task-project-manager.git
   cd task-project-manager
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your .env file:
   ```bash
   npm run dev
   ```
4. Start the application:
   ```bash
   npm run build
   npm start
   ```
