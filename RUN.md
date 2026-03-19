# Running the Project

Follow these steps to get the Fake News Detection website up and running.

## Prerequisites
- Python 3.8+
- Node.js & npm

## Backend Setup (Python)
1. Navigate to the root folder.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the API server:
   ```bash
   python api.py
   ```
   The API will start at `http://localhost:8000`.

## Frontend Setup (React)
1. Navigate to the `/frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The website will be available at `http://localhost:5173`.

## Usage
1. Open `http://localhost:5173` in your browser.
2. Create an account via the **Sign Up** page.
3. **Login** with your new credentials.
4. Paste a news article into the dashboard and click **Analyze**.
