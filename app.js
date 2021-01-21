const express = require('express');
const env = require('dotenv');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

//routes
const authRoutes = require('./src/routes/auth');
const adminRoutes = require('./src/routes/admin/auth');
const categoryRoutes = require('./src/routes/category');
const productRoutes = require('./src/routes/product');
const cartRoutes = require('./src/routes/cart');
const initialDataRoutes = require('./src/routes/admin/initialData');
const addressRoutes = require('./src/routes/address');
const orderRoutes = require('./src/routes/order');
const adminOrderRoutes = require('./src/routes/admin/order.routes')

//environment variable or you can say constants
env.config();

// mongodb connection
//mongodb+srv://anshul:<password>@cluster0.qysex.mongodb.net/<dbname>?retryWrites=true&w=majority
mongoose.connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.qysex.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true
    }
).then(() => {
    console.log('Database connected');
});

app.use(cors())
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'src/uploads')));
// app.use("/public", express.static(path.join(__dirname + '/public', "uploads")));
// app.use('/public', express.static(process.cwd() + '/public', 'uploads'));
app.use('/api', authRoutes);
app.use('/api', adminRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);
app.use('/api', initialDataRoutes);
app.use('/api', addressRoutes);
app.use('/api', orderRoutes);
app.use('/api', adminOrderRoutes);



app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});