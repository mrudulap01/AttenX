# AttenX

AttenX is an AI-powered attendance tracking application. It utilizes a React frontend, a Spring Boot backend, and a Python-based AI service for face recognition and spoof detection. All services, including PostgreSQL and Redis, are seamlessly managed via Docker Compose.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [Docker](https://www.docker.com/products/docker-desktop/) (Docker Desktop is recommended for Windows/Mac)
- [Git](https://git-scm.com/)

## Getting Started

### 1. Clone the Repository

Clone the project to your local machine:
```bash
git clone https://github.com/mrudulap01/AttenX.git
cd AttenX
```

### 2. Run the Application

Start all services using Docker Compose. Open your terminal in the root `AttenX` directory and run:

```bash
docker compose up -d --build
```
*Note: The initial build may take a few minutes as it downloads the base images and builds the application environments.*

### 3. Access the Application

Once all containers are up and running, you can access the application via your browser:

- **Frontend UI:** [http://localhost](http://localhost)
- **Backend API:** `http://localhost:8080`
- **AI Service:** `http://localhost:8000`

### 4. Stopping the Application

To stop the services and clean up the containers, run:
```bash
docker compose down
```

## Architecture

- **Frontend:** React + Vite
- **Backend:** Java 21 + Spring Boot 3
- **AI Service:** Python + FastAPI + InsightFace
- **Database:** PostgreSQL
- **Cache:** Redis
