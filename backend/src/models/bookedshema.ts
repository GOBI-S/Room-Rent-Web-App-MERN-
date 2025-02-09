import mongoose, { Document, Schema } from 'mongoose';

interface IBooked {
    bookerId: string;
    from: Date;
    to: Date;
}

interface IRoom extends Document {
    roomid: string;
    booked: IBooked[];
}

const bookedSchema = new Schema({
    bookerId: { type: String, required: true },
    from: { type: Date, required: true },
    to: { type: Date, required: true },
});

const roomSchema = new Schema({
    roomid: { type: String, required: true, unique: true },
    booked: [bookedSchema],
});

const Room = mongoose.model<IRoom>('Room', roomSchema);

export default Room;