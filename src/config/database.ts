import mongoose from 'mongoose';

const connectDatabase = async (): Promise<void> => {
    try {
        const con = await mongoose.connect(process.env.DB_LOCAL_URI as string, {});
        console.log(`MongoDB connected to the host: ${con.connection.host}`);
    } catch (err) {
        console.error(`Error connecting to the database: ${(err as Error).message}`);
    }
}

export default connectDatabase;
