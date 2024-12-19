const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')


const dotenv = require('dotenv');
const noteRoutes = require('./src/features/notes/note.routes')

const app = express();
app.use(cors())
app.use(express.json())



// middleware
if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.production' })
} else {
    dotenv.config({ path: '.env.development' })
}

console.log(process.env.MONGO_URI)

//mongo db connection 
mongoose.connect(process.env.MONGO_URI, {})
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err))


app.use('/api', noteRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server is running in ${process.env.NODE_ENV} mode on port ${PORT}`))