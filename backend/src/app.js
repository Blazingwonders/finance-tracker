import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

import expenseRoutes from './routes/expenses.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';
import { connectDB } from './config/db.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Store the current result in memory
let currentResult = null;

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api/expenses', expenseRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});


// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files to the 'uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Use unique filenames
    },
});

const upload = multer({ storage });

// Create uploads directory if it doesn't exist
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}


// Define the /api/data endpoint ONCE
app.get('/api/data', (req, res) => {
    if (!currentResult) {
        res.json({
            success: false,
            message: "No data available",
            data: null
        });
        return;
    }
    res.json(currentResult);
});

// Handle file upload
app.post('/upload', upload.single('image'), async (req, res) => {
    try {
        console.log('File received:', req.file); // Log the file details
        
        // Process the image
        const result = await sendApiRequest(req.file.filename);
        await processResponse(result);
        
        res.status(200).json({ 
            message: 'File uploaded successfully!', 
            file: req.file 
        });
    } catch (error) {
        console.error('Error processing upload:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error processing upload' 
        });
    }
});



// create a proxy to gemini Api

async function sendApiRequest(filename) {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const filepath = 'uploads/' + filename;
    const prompt = "List all purchased products from the bill. Your response shall be in the Form of a JSON object. If there are no purchases on the image handle over a JSON containing the message {error: no purchases detected}. Combine every detected purchase with a number that symbolises your confidence in your detection. Please also include the product into the categories of ['Food', 'Transport', 'Housing', 'Entertainment', 'Clothing', 'Other']. Every object must therefore contain: product, price, quantity, category and confidence.";
    
    // Note: The only accepted mime types are some image types, image/*.
    const imagePart = fileToGenerativePart(filepath,"image/jpeg");
    const result = await model.generateContent([prompt, imagePart]);
    console.log(result.response.text());
    return result.response.text();
}

function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType,
        },
    };
}

function processResponse(result) {
    let formattedResult = result.replace("```json", "").replace("```", "");
    //console.log(formattedResult);
    let resultJSON = JSON.parse(formattedResult);
    console.log(resultJSON);
    //var responseToClient;
    //console.log(resultJSON.error);
   
    if(resultJSON.error == "no purchases detected") {
        currentResult = {
            success: false,
            message: "Uploaded Image shows no purchases",
            data: resultJSON
        };

        //sendErrorToClient(resultJSON);
    } else {
        currentResult = {
            success: true,
            message: "Data retrieved successfully",
            data: resultJSON
        };
        //sendResponseToClient(resultJSON);
    }
}

/*
function sendResponseToClient(resultJSON) {
    console.log("Results found: " + resultJSON)
    app.get('/api/data', (req, res) => {
        res.json({
            success: true,
            message: "Data retrieved successfully",
            data: resultJSON
        });
    });
}

function sendErrorToClient(resultJSON) {
    app.get('/api/data', (req, res) => {
        res.json({
            success: false,
            message: "Uploaded Image shows no purchases",
            data: resultJSON
        });
    });
}
*/


// Connect to database and start server
connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });