## Run Locally

### Prerequisites
Before running the project, make sure you have the following installed on your machine:

- **Node.js** (v20 or higher)
- **Docker** 
- **Docker Compose**

### Clone the project

```bash
git clone https://github.com/kfahad5607/compute-marketplace
```

### Go to the project directory

```bash
cd compute-marketplace
```

### Navigate to the backend directory

```bash
cd backend
```

### Start the PostgreSQL database

```bash
docker-compose up
```

### Set up environment variables

1. Open a new terminal window and navigate back to the backend directory:

   ```bash
   cd backend
   ```

2. Create a .env file by copying the provided .env.sample:

   ```bash
   cp .env.sample .env
   ```

3. Replace the placeholder values with your own. You can refer to the docker-compose.yml file in the backend directory for the database environment variables.

### Install backend dependencies

```bash
npm install
```

### Create tables in the database

```bash
npx drizzle-kit push
```

### Start the backend server

```bash
npm run dev
```

## Frontend Setup

### Navigate to the frontend directory

```bash
cd ../frontend
```

### Install frontend dependencies

```bash
npm install
```

### Start the frontend server

```bash
npm run dev
```

## Access the Application

Once both the backend and frontend servers are running, you can access the application in your browser by visiting:

[http://127.0.0.1:5173](http://127.0.0.1:5173)