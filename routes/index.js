import express from 'express';
import { Url } from '../models/url.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

const router = express.Router();

// Home page - serve the frontend
router.get('/', (req, res) => {
    res.render('index');
});

// Redirect short URL to original URL
router.get('/:shortCode', asyncHandler(async (req, res) => {
    const { shortCode } = req.params;
    
    // Find the URL and increment the click count
    const url = await Url.findOneAndUpdate(
        { shortCode },
        { $inc: { clicks: 1 } },
        { new: true }
    );

    if (!url) {
        throw new ApiError(404, 'URL not found');
    }

    // Redirect to the original URL
    res.redirect(url.longUrl);
}));

export default router;
