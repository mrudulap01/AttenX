# AttenX

AttenX is a full-stack Smart Attendance System with Face Recognition capabilities. It features a React frontend, a Spring Boot backend, and a FastAPI AI Service.

## Architecture

*   **Frontend**: React, Vite, TailwindCSS (runs on port 80 via Nginx in Docker)
*   **Backend**: Java, Spring Boot 3, Spring Security with JWT (runs on port 8080)
*   **AI Service**: Python, FastAPI, DeepFace for face recognition (runs on port 8000)
*   **Database**: PostgreSQL
*   **Cache**: Redis

## Prerequisites

Before running this project, ensure you have the following installed on your machine:
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Must be running before starting the app)
*   [Git](https://git-scm.com/)

## How to Run Locally

1. **Clone the repository**
   Open your terminal and run:
   ```bash
   git clone https://github.com/mrudulap01/AttenX.git
   ```

2. **Navigate to the project directory**
   ```bash
   cd AttenX
   ```

3. **Start the application**
   Make sure Docker Desktop is open and running in the background. Then, execute the following command to build and start all the containers:
   ```bash
   docker compose up -d --build
   ```

4. **Access the application**
   Once all containers are healthy, you can access the various services:
   *   **Frontend UI**: [http://localhost](http://localhost)
   *   **Backend API**: [http://localhost:8080/api/v1](http://localhost:8080/api/v1)
   *   **AI Service API**: [http://localhost:8000/api/v1](http://localhost:8000/api/v1)

5. **Stop the application**
   To stop the services without losing your data:
   ```bash
   docker compose down
   ```

## Development Notes

### Mock Email System
The application currently uses a mock email system. When you register a new account, a verification link is "sent" to your email. 
To actually see the verification link, you need to check the backend logs. Run:
```bash
docker logs attenx-backend-1
```
Look for a printout containing the `http://localhost:8080/api/v1/auth/verify?token=...` link and open it in your browser to verify your account so you can log in.
