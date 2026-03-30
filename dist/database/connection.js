import mongoose from 'mongoose';
export async function connectToDB() {
    //  await mongoose.connect('mongodb+srv://redaellimariano1:jqP21PGqccT20Enx@cluster0.r2qqj8e.mongodb.net/myGames?retryWrites=true&w=majority&appName=Cluster0');
    await mongoose.connect('mongodb://localhost:27017/local');
}
