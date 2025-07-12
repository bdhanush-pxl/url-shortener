import mongoose, { Schema } from 'mongoose';

const urlSchema = new Schema(
    {
        longUrl: {
            type: String,
            required: true,
            trim: true
        },
        shortUrl: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        shortCode: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        clicks: {
            type: Number,
            default: 0
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null
        }
    },
    { timestamps: true }
);

export const Url = mongoose.model('Url', urlSchema);
