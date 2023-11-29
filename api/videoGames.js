const express = require('express');
const router = express.Router();
const { getAllVideoGames, getVideoGameById, createVideoGame, updateVideoGame, deleteVideoGame } = require('../db/videoGames');

// GET - /api/video-games - get all video games
router.get('/', async (req, res, next) => {
    try {
        const videoGames = await getAllVideoGames();
        res.status(200).json(videoGames);
    } catch (error) {
        next(error);
    }
});

// GET - /api/video-games/:id - get a single video game by id
router.get('/:id', async (req, res, next) => {
    try {
        const videoGame = await getVideoGameById(req.params.id);
        if (videoGame) {
            res.status(200).json(videoGame);
        } else {
            res.status(404).json({ message: 'Video game not found' });
        }
    } catch (error) {
        next(error);
    }
});

// POST - /api/video-games - create a new video game
router.post('/', async (req, res, next) => {
    try {
        const newVideoGame = await createVideoGame(req.body);
        res.status(201).json(newVideoGame);
    } catch (error) {
        next(error);
    }
});

// PUT - /api/video-games/:id - update a single video game by id
router.put('/:id', async (req, res, next) => {
    try {
        const updatedVideoGame = await updateVideoGame(req.params.id, req.body);
        if (updatedVideoGame) {
            res.status(200).json(updatedVideoGame);
        } else {
            res.status(404).json({ message: 'Video game not found' });
        }
    } catch (error) {
        next(error);
    }
});

// DELETE - /api/video-games/:id - delete a single video game by id
router.delete('/:id', async (req, res, next) => {
    try {
        const deletedVideoGame = await deleteVideoGame(req.params.id);
        if (deletedVideoGame) {
            res.status(200).json(deletedVideoGame);
        } else {
            res.status(404).json({ message: 'Video game not found' });
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
