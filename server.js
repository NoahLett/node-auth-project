const express = require('express');
const path = require('path');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const PORT = process.env.PORT || 3500;
const app = express();

app.use(logger);

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

//Protected Routes
app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));

app.all('*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
