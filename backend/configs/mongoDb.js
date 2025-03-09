import mongoose from 'mongoose';

//Connect to mongoDb

const connectDb = async()=>{
       mongoose.connection.on('connected',()=>{
        console.log('Database Connected') })
        await mongoose.connect(`${process.env.MONGO_URI}/LMS`)
}

export default connectDb;