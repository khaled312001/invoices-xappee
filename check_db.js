const mongoose = require('mongoose');

const uri = "mongodb+srv://xappeesoftware:LMph7vvVk1gvgSMU@xappeedb.qd91bec.mongodb.net/?retryWrites=true&w=majority";

const userSchema = new mongoose.Schema({
    email: String,
    role: String,
    client: String,
    status: String
}, { collection: 'users' });

const User = mongoose.model('User', userSchema);

async function checkUsers() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
        
        const users = await User.find({}, 'email role client status');
        console.log("Users found:");
        console.log(JSON.stringify(users, null, 2));
        
        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err);
    }
}

checkUsers();
