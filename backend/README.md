# Intelligent Forecasting System (IFS) Backend

This is the backend service for the Intelligent Forecasting System, providing API endpoints for data ingestion, schema mapping, forecasting, and more.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```
DATABASE_URL=postgresql://user:password@localhost:5432/ifs_db
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

4. Run database migrations:
```bash
alembic upgrade head
```

5. Start the server:
```bash
uvicorn app.main:app --reload
```

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── api/
│   ├── core/
│   ├── models/
│   └── services/
├── tests/
├── alembic/
└── requirements.txt
```

## Features

- Data ingestion and schema mapping
- Data profiling and validation
- Intelligent model selection
- Forecast generation
- API endpoints for integration
- Authentication and authorization
- Data export capabilities
