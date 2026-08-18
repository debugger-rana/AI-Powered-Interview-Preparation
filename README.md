# AI-Powered Interview Preparation Platform

## Project Overview

This is a full-stack interview preparation platform that helps users practice and prepare with AI-generated interview insights.

Users can:
- Upload a resume (PDF)
- Add self-description and job description
- Generate an AI interview preparation report
- Review report history
- Generate a tailored resume PDF

The application uses a React frontend and a Node/Express backend with MongoDB.

---

## Key Features

- AI-powered interview report generation
- Resume PDF parsing and analysis
- Tailored resume PDF generation
- User authentication (JWT + cookies)
- Token blacklist on logout
- Interview report history and detail view
- Protected routes and credentialed API requests

---

## Tech Stack

### Frontend
- React 19
- Vite
- React Router
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- JWT
- Multer (file upload)
- PDF Parse
- Google GenAI SDK
- Puppeteer (PDF generation)

---

## Project Structure

```text
AI-Powered Interview Preparation Platform/
├── Frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   └── interview/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── Backend/
    ├── src/
    │   ├── config/
    │   ├── controllers/
    │   ├── middlewares/
    │   ├── models/
    │   ├── routes/
    │   ├── services/
    │   └── app.js
    ├── server.js
    └── package.json
```

---

## Local Development Setup

### Prerequisites
- Node.js 18+
- npm
- MongoDB Atlas URI (or local MongoDB)
- Google GenAI API key

### 1. Clone and install

```bash
git clone https://github.com/debugger-rana/AI-Powered-Interview-Preparation.git
cd AI-Powered-Interview-Preparation

cd Backend
npm install

cd ../Frontend
npm install
```

### 2. Backend env file

Create `Backend/.env`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_GENAI_API_KEY=your_google_genai_key
FRONTEND_URL=http://localhost:5173
```

### 3. Frontend env file

Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
```

### 4. Run locally

Backend:

```bash
cd Backend
npm run dev
```

Frontend:

```bash
cd Frontend
npm run dev
```

Local URLs:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

---

## Deployment (Vercel + Render)

### Frontend (Vercel)

- Root directory: `Frontend`
- Build command: `npm run build`
- Output directory: `dist`

Set this environment variable in Vercel:

```env
VITE_API_URL=https://ai-interview-backend-ls81.onrender.com
```

### Backend (Render)

- Root directory: `Backend`
- Build command: `npm install`
- Start command: `node server.js`

Set these environment variables in Render:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_GENAI_API_KEY=your_google_genai_key
FRONTEND_URL=https://ai-powered-interview-preparation-one.vercel.app
NODE_ENV=production
```

Important:
- Keep `FRONTEND_URL` without trailing slash.
- Keep `VITE_API_URL` without trailing slash.
- Redeploy both services after changing environment variables.

---

## API Endpoints

### Auth
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/logout`
- GET `/api/auth/get-me`

### Interview
- POST `/api/interview/` (multipart form data with resume)
- GET `/api/interview/`
- GET `/api/interview/report/:interviewId`
- POST `/api/interview/resume/pdf/:interviewReportId`

---

## Troubleshooting

### CORS errors in production
- Verify `FRONTEND_URL` in Render exactly matches deployed Vercel origin.
- Confirm backend redeployed after env change.

### API still calling localhost in production
- Verify `VITE_API_URL` exists in Vercel project settings.
- Redeploy Vercel after env updates.

### Login works but session not retained
- Check browser cookie policy for cross-site cookies.
- Confirm requests are sent with credentials.

---

## License

For educational and portfolio use.
