const express = require('express');
const env = require('dotenv');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

// enviourment variables
env.config();

// middlewares
app.use(cors());
app.use(express.json());

// routes
const userRoutes = require('./routes/user.routes');
const testRoutes = require('./routes/test.routes');

app.use('/public', express.static(path.join(__dirname, "uploads")));
app.use('/api', userRoutes)
app.use('/api', testRoutes)

app.get('/',(req,res)=>{
    res.send('server is ready')
})

// mongodb connection
const connectDB = (dburl) => {
    return mongoose.connect('mongodb+srv://amazona:1234@tly.nu8g3re.mongodb.net/?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useCreateIndex: true,
        // useFindAndModify: false,
    }).then(() => {
        console.log('Database Connected');
    })
}

const start = async () => {
    try {
        const PORT =process.env.PORT || 5000;
        await connectDB('mongodb+srv://amazona:1234@tly.nu8g3re.mongodb.net/?retryWrites=true&w=majority');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}
  
start();