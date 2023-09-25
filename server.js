require('dotenv').config();
const express = require('express');
const path = require('path');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const app = express();

connectDB();

app.use(logger);

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//Static File
app.use('/', express.static(path.join(__dirname, '/public')));

//Routes
app.use('/', require('./routes/root'));
app.use('/register' , require('./routes/api/register'));
app.use('/auth' , require('./routes/api/auth'));
app.use('/refresh' , require('./routes/api/refresh'));
app.use('/logout' , require('./routes/api/logout'));

//Protected Routes
app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));

app.all('*', (req, res) => {
    res.status(404).json({ "message": `cannot ${req.method} ${req.url}` });
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
});
