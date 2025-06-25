# AI-Powered Expense Tracker
An intelligent expense tracking application that uses AI to automatically extract purchase information from receipt images. Built with Node.js/Express backend and powered by Google's Gemini AI for receipt analysis.


## ***Features***
- 📸 AI Receipt Scanning: Upload receipt images and automatically extract product details
- 💰 Expense Management: Create, view, and categorize expenses manually or via AI
- 📊 Interactive Dashboard: Real-time pie charts showing expense breakdown by category
- 🕐 Time-based Filtering: View expenses by week, month, year, or all time
- 🧠 Smart Categorization: AI automatically categorizes purchases into predefined categories
- 🔍 Confidence Scoring: Each detected item includes a confidence score for accuracy assessment
- 📱 Responsive Design: Mobile-friendly interface with intuitive controls
- 💾 Persistent Storage: PostgreSQL database for reliable expense data retention
- 🌐 RESTful API: Clean API endpoints for seamless frontend-backend communication

## Technology Stack

Frontend
- Vanilla JavaScript for interactive functionality
- Chart.js for data visualization and pie charts
- HTML5 with modern form controls and file upload
- CSS3 with responsive design and animations
- Fetch API for seamless backend communication

Backend
- Node.js with Express.js framework
- PostgreSQL for data persistence
- Google Gemini AI for receipt image analysis
- Multer for file upload handling
- CORS for cross-origin resource sharing

AI Integration
- Google Generative AI (Gemini 1.5 Flash model)
- Image processing and text extraction
- Automatic product categorization
- Confidence scoring for detected items

## Project Structure

```
project-root/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js                 # Database configuration
│   │   ├── controllers/
│   │   │   └── expenseController.js  # Expense CRUD operations
│   │   ├── middleware/
│   │   │   ├── asyncHandler.js       # Async error handling
│   │   │   ├── errorHandler.js       # Global error handler
│   │   │   ├── requestLogger.js      # HTTP request logging
│   │   │   └── validateExpense.js    # Input validation
│   │   ├── routes/
│   │   │   └── expenses.js           # Expense routes
│   │   └── app.js                    # Main application file
│   ├── uploads/                      # Receipt image storage
│   └── package.json
├── frontend/
│   └── web/
│       ├── index.html                # Main HTML interface
│       ├── script.js                 # Frontend JavaScript logic
│       └── styles.css                # CSS styling
└── .gitignore
```

## Installation

Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database
- Google Cloud Platform account with Generative AI API access

Setup
1. Clone the repository
```
git clone <repository-url>
cd expense-tracker
```
2. Install dependencies
```
cd backend
npm install
```
3. Database Setup
- Create a PostgreSQL database
- Create the expenses table:
```
CREATE TABLE expotable (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    date VARCHAR(20) NOT NULL,
    description TEXT
);
```
4. Environment Configuration
Create a `.env` file in the backend directory:

```
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_username
DB_PASSWORD=your_password

# Google AI Configuration
API_KEY=your_google_generative_ai_api_key

# Server Configuration
PORT=8080
NODE_ENV=development
```

5. Get Google AI API Key
- Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
- Create a new API key
- Add it to your `.env` file

6. Start the server
```
npm start
```
The server will start on `http://localhost:8080`

7. Set up the frontend

- Navigate to the frontend/web directory
- Open index.html in a web browser or serve it with a local server
- The frontend will connect to the backend at `http://localhost:8080`

## API Endpoints

#### Health Check
```
GET /health
```
Returns server status

#### Expense Management

Retrieve all expenses:
```
GET /api/expenses
```

Create a new expense:
```
POST /api/expenses
```
```
{
  "category": "Food",
  "price": "15.50 €",
  "date": "2024-01-15",
  "description": "Lunch at restaurant"
}
```

#### AI Receipt Processing
```
POST /upload
```

Upload receipt image for AI analysis:
- Content-Type: multipart/form-data
- Field name: image
- Supported formats: JPEG, PNG


GET /api/data

## Frontend Features

### Interactive Dashboard
- **Real-time Pie Charts**: Visual breakdown of expenses by category using Chart.js
- **Time Filtering**: Dynamic filtering options (Week/Month/Year/All Time/Custom)
- **Live Updates**: Charts automatically refresh when new expenses are added
- **Total Expenditure Display**: Shows current total spending with currency formatting

### Expense Management Interface
- **Manual Entry**: Intuitive dropdown menus for category, price, date, and description
- **Form Validation**: Client-side validation with user-friendly error messages
- **Smart Defaults**: Date picker defaults to current date, prevents future dates
- **Visual Feedback**: Buttons change color when filled, progressive form completion

### AI Receipt Processing
- **Drag & Drop Upload**: Modern file upload interface with visual feedback
- **Image Preview**: Shows selected file name before upload
- **Processing Status**: Real-time feedback during AI analysis
- **Results Display**: Formatted display of detected items with categories and prices
- **Batch Addition**: Add all AI-detected expenses with one click

### User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Progressive Enhancement**: Graceful degradation if JavaScript is disabled
- **Loading States**: Visual indicators during data fetching and processing
- **Error Handling**: User-friendly error messages for failed operations


Expense Categories
The system automatically categorizes expenses into:

- Food: Groceries, restaurants, snacks
- Transport: Gas, public transport, parking
- Housing: Rent, utilities, maintenance
- Entertainment: Movies, games, subscriptions
- Clothing: Apparel, shoes, accessories
- Other: Miscellaneous expenses

## AI Response Format
When processing receipts, the AI returns data in this format:

```
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": [
    {
      "product": "Coffee",
      "price": 3.50,
      "quantity": 1,
      "category": "Food",
      "confidence": 0.95
    },
    {
      "product": "Sandwich",
      "price": 8.25,
      "quantity": 1,
      "category": "Food",
      "confidence": 0.89
    }
  ]
}
```

## Troubleshooting
### Common Issues

1. #### Database Connection Failed
- Verify PostgreSQL is running
- Check database credentials in .env
- Ensure database exists


2. ### AI API Errors
- Verify Google AI API key is valid
- Check API quota and billing
- Ensure image format is supported


3. ### Frontend Connection Issues
- Ensure backend is running on port 8080
- Check CORS configuration in backend
- Verify API endpoints are accessible
- Check browser console for JavaScript errors
 

4. ### Chart Display Problems
- Ensure Chart.js CDN is accessible
- Check if data is being fetched correctly
- Verify canvas element is present in DOM


5. ### File Upload Issues
- Check uploads/ directory exists
- Verify file permissions
- Ensure image file is valid

## License
### This project is licensed under the MIT License.