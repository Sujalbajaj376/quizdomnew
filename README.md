<div align="center">
    <h1>QUIZ<b>DOM🧠</b></h1>
</div>

## 🎓Overview

QUIZDOM is a web application for all kinds of users. Users can simply log in to be able to create and join quizzes by sharing the quiz code. There might be lots of quiz-generating applications, but the idea of creating a quiz and then taking it on the same platform and evaluating the students in such a way is the key feature of this application.

## ⏯ Preview

Take a look at the live <a href="#" target="_blank">Preview of the app.</a>

## 🚀 Configuration Guidelines

- Create an account on firebase.google.com and add the API key in the .env file.
- Add the MongoDB API key (either the local server key or from the Atlas MongoDB remote server) in the .env file.
- Install MongoDB Server if you want to use the database locally.
- Install Node.js to use npm and node services.

### Local Development

1. Clone the repository
   ```
   git clone [repository-url]
   cd [repository-name]
   ```

2. Install dependencies
   ```
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   MONGO_URL=your_mongodb_connection_string
   PORT=8000
   ```

4. Start the development servers
   ```
   # Start backend server
   cd backend
   npm start
   
   # In a new terminal, start frontend server
   cd frontend
   npm start
   ```

### Deployment on Vercel

1. Push your code to GitHub

2. Create a new project on Vercel and import your GitHub repository

3. Configure the project settings:
   - Build Command: `cd frontend && npm install && npm run build`
   - Output Directory: `frontend/build`
   - Install Command: `npm install`
   - Root Directory: `/`

4. Add environment variables in Vercel:
   - `MONGO_URL`: Your MongoDB connection string

5. Deploy the project

## Supported Environments

- Windows/ macOS/ Linux operating systems are supported for the development of the respective project.

## Blind Quiz Commands

- The Blind Quiz Module works with limited Speech Commands to interact with the App.
- Press `space` to turn the microphone on.
- Voice Commands:
  - `Instructions`: To listen to all the possible commands.
  - `start Quiz` or `title`: To hear the Quiz title and first Question.
  - `Select Option [Number]` or `Choose Option [Number]`: To mark the option of the current Question.
  - `next question`: to increment the question index and move to the next question and listen to it.
  - `previous question`: to decrement the question index and move to the previous question and listen to it
  - `Repeat Question [Number]`: To hear a specific Question.
  - `Repeat Current Question`: To repeat the current Question.
  - `submit quiz`: to submit the quiz.
