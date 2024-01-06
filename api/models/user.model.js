import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true
    },
    avatar:{
        type:String,
        default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.flaticon.com%2Ffree-icon%2Fuser_666201&psig=AOvVaw1TTqHib6soes_rEdiTsfWk&ust=1704624824825000&source=images&cd=vfe&ved=0CBMQjRxqFwoTCODd08DMyIMDFQAAAAAdAAAAABAJ"
    },
    email:{
        type:String,
        required: true,
        unique: true,
    }
},   {timestamps: true});

const User = mongoose.model('User',userSchema);

export default User;