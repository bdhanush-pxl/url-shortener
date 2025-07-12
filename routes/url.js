import express from 'express';
import { check } from 'express-validator';
import { Url } from '../models/url.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const router = express.Router();

// Generate a short code
const generateShortCode = () => {
    return Math.random().toString(36).substring(2, 8);
};

// @route   POST /api/url/shorten
// @desc    Create short URL
export const shortenUrl = asyncHandler(async (req, res) => {
    const { longUrl } = req.body;

    if (!longUrl) {
        throw new ApiError(400, 'URL is required');
    }

    // Check if URL already exists
    const existingUrl = await Url.findOne({ longUrl });
    
    if (existingUrl) {
        return res
            .status(200)
            .json(
                new ApiResponse(200, existingUrl, 'URL already shortened')
            );
    }

    // Generate short code
    const shortCode = generateShortCode();
    // Use BASE_URL from environment variables if available, otherwise fall back to request host
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const shortUrl = `${baseUrl}/${shortCode}`.replace(/([^:]\/)\/+/g, '$1'); // Remove double slashes

    // Create new URL
    const url = await Url.create({
        longUrl,
        shortUrl,
        shortCode
    });

    return res
        .status(201)
        .json(
            new ApiResponse(201, url, 'URL shortened successfully')
        );
});

// @route   GET /api/url
// @desc    Get all URLs
export const getAllUrls = asyncHandler(async (req, res) => {
    const urls = await Url.find({}).sort({ createdAt: -1 });
    
    return res
        .status(200)
        .json(
            new ApiResponse(200, urls, 'URLs fetched successfully')
        );
});

// @route   GET /:shortCode
// @desc    Redirect to original URL
export const redirectToOriginalUrl = asyncHandler(async (req, res) => {
    const { shortCode } = req.params;
    
    const url = await Url.findOneAndUpdate(
        { shortCode },
        { $inc: { clicks: 1 } },
        { new: true }
    );

    if (!url) {
        throw new ApiError(404, 'URL not found');
    }

    return res.redirect(url.longUrl);
});

// Routes
router.post('/shorten',
    [
        check('longUrl', 'Please include a valid URL').isURL()
    ],
    shortenUrl
);

router.get('/', getAllUrls);
router.get('/:shortCode', redirectToOriginalUrl);

export default router;
