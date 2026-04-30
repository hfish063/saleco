## Running the Application

### Database
The following column must be added to run the application properly.
```
ALTER TABLE CUSTOMER
ADD COLUMN CUST_PASSWORD varchar(32);
```

### Backend

1. Activate python virtual environment `source .venv/bin/activate`

- You might need to create a new virtual envirionment with `python -m venv .venv`

2. Install required dependencies using `pip install -r requirements.txt`

3. Create `.env` with MySQL connection information (See .env.example for the required variables)

4. Start the backend with `fastapi dev`. Will establish connection with database from credentials in `.env`

FastAPI generates an OpenAPI spec for the backend automatically, to easily interact with endpoints navigate to `localhost:8000/docs`

### Frontend

1. Install dependencies using `npm install`

2. Run the application with `npm run dev`

3. Access the web interface at `http://localhost:3000`
