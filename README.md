# Online Test Platform

This document provides a step-by-step guide to setting up the Online Test Platform on your local machine. The platform is built using Node.js and MongoDB and includes user authentication, test management, question handling, and result processing.

## Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (v14 or later recommended)
- [MongoDB](https://www.mongodb.com/) (Ensure MongoDB is running locally or provide a remote connection string)
- [Git](https://git-scm.com/) (for cloning the repository)

## Installation Steps

### 1. Clone the Repository

```powershell
git clone https://github.com/Rohit3124/Online-Test-Platform.git
cd Online-Test-Platform
```

### 2. Install Dependencies

```powershell
cd backend
npm install
cd ../frontend
npm install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
PORT=3000
MONGODB_URL=<your_mongodb_connection_string>
JWT_SECRET_KEY=<your_secret_key>
```

### 4. Run the Frontend

From the root directory, run:

```powershell
cd frontend
npm run dev
```

### 5. Run the Backend

From the root directory, run:

```powershell
cd backend
nodemon index.js
```

The server should start and display:

```
Connected to MongoDB...
Listening on port 3000...
```

## Project Structure

```
|-- routes/
|   |-- user.route.js
|   |-- auth.route.js
|   |-- test.route.js
|   |-- question.route.js
|   |-- result.route.js
|-- index.js
|-- package.json
|-- .env
```

## Basic API Endpoints

- `POST /api/user/signup` - Register a new user
- `POST /api/auth/signin` - Login user
- `POST /api/exam/create` - Create a new test
- `GET /api/exam/getExams` - Fetch test details
- `POST /api/questions/create` - Add a question
- `GET /api/questions/getQuestions?testId=ID` - List questions by ID
- `POST /api/results/create` - Create result record
- `GET /api/results/getResult` - Retrieve authenticated user result

## Notes

- Ensure the `.env` file is correctly set up before running the application.
- Modify `PORT` in `.env` if needed.
- If facing MongoDB connection issues, verify `MONGODB_URL` is correctly set.
- SSO with Google will currently work only for the test email configured in the Google Cloud Console.
- For accessing the admin interface, try signing in using admin credentials:

  ```
  email: admin@gmail.com  
  password: 123456
  ```

