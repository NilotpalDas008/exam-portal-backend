# Exam Portal Backend

A RESTful API backend for an online examination portal built with Node.js, Express, and SQLite.

## Features

- **Student Management**: Register and manage student profiles
- **Exam Management**: Create and manage exams with multiple question types
- **Exam Sessions**: Track individual student exam attempts with session management
- **Response Tracking**: Store and retrieve student answers for each question
- **Telemetry**: Monitor student activity and behavior during exams
- **Real-time Monitoring**: Track clicks, stress levels, and exam events

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Database**: SQLite3 (better-sqlite3)
- **Environment**: dotenv for configuration
- **CORS**: Enabled for cross-origin requests

## Project Structure

```
backend/
├── src/
│   ├── app.js              # Express app configuration
│   ├── server.js           # Server entry point
│   ├── controllers/        # Request handlers
│   │   ├── examController.js
│   │   ├── sessionController.js
│   │   └── studentController.js
│   ├── routes/            # API route definitions
│   │   ├── examRoute.js
│   │   ├── sessionRoute.js
│   │   └── studentRoute.js
│   ├── models/            # Database schema
│   │   └── schema.js
│   ├── db/                # Database connection
│   │   ├── db.js
│   │   └── initDb.js
│   └── middlewares/       # Custom middleware
│       ├── errorHandler.js
│       └── validate.js
├── db/
│   └── schema.sql
└── package.json
```

## Database Schema

### Tables

1. **students**: Store student information
   - `id`, `student_id`, `name`, `created_at`

2. **exams**: Exam metadata
   - `id`, `title`, `start_time`, `end_time`, `created_at`

3. **questions**: Exam questions
   - `id`, `exam_id`, `text`, `type`, `options`, `answer_key`

4. **exam_sessions**: Track student exam attempts
   - `id`, `student_id`, `exam_id`, `started_at`, `submitted_at`, `total_clicks`, `stress_level`, `feedback`

5. **responses**: Student answers to questions
   - `id`, `session_id`, `question_id`, `answer`, `updated_at`

6. **telemetry_events**: Monitor student activity
   - `id`, `session_id`, `type`, `value`, `created_at`

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=5000
```

4. Start the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start at `http://localhost:5000`

## API Endpoints

### Students
- `POST /api/students` - Register a new student
- `GET /api/students/:id` - Get student details
- Additional student endpoints as defined in studentRoute.js

### Exams
- `POST /api/exams/:examId/start` - Start an exam session
  - Body: `{ "studentDbId": <student_id> }`

### Sessions
- Session management endpoints as defined in sessionRoute.js

### Admin
- `POST /api/admin/seed` - Seed database with sample exam data

## Scripts

- `npm start` - Run the server in production mode
- `npm run dev` - Run the server in development mode with nodemon

## Development

The application uses:
- **better-sqlite3** for synchronous SQLite operations
- **Express middleware** for request validation and error handling
- **CORS** enabled for frontend integration
- **Automatic schema initialization** on server start

## Error Handling

The application includes a centralized error handler middleware that catches and formats errors consistently across all endpoints.

## Dependencies

### Production
- `express`: ^5.2.1 - Web framework
- `better-sqlite3`: ^12.6.2 - SQLite database
- `cors`: ^2.8.5 - CORS middleware
- `dotenv`: ^17.2.3 - Environment configuration

### Development
- `nodemon`: ^3.1.11 - Development auto-reload

## License

ISC

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
