const mongoose = require('mongoose');

async function connectDB(url){
    try{
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Database connected successfully');
    }
    catch(err){
        console.log(err);
    }
}

module.exports = {connectDB};