const client = require('./client');
const util = require('util');

// GET - /api/video-games - get all video games
async function getAllVideoGames() {
    try {
        const { rows: videoGames } = await client.query('SELECT * FROM videoGames;');
        return videoGames;
    } catch (error) {
        throw new Error("Error in getAllVideoGames: " + error.message);
    }
}

// GET - /api/video-games/:id - get a single video game by id
async function getVideoGameById(id) {
    try {
        const { rows: [videoGame] } = await client.query(`
            SELECT * FROM videoGames
            WHERE id = $1;
        `, [id]);
        return videoGame;
    } catch (error) {
        throw new Error("Error in getVideoGameById: " + error.message);
    }
}

// POST - /api/video-games - create a new video game
async function createVideoGame({ title, genre, releaseYear }) {
    try {
        const { rows: [newVideoGame] } = await client.query(`
            INSERT INTO videoGames (title, genre, releaseYear)
            VALUES ($1, $2, $3)
            RETURNING *;
        `, [title, genre, releaseYear]);
        return newVideoGame;
    } catch (error) {
        throw new Error("Error in createVideoGame: " + error.message);
    }
}

// PUT - /api/video-games/:id - update a single video game by id
async function updateVideoGame(id, fields = {}) {
    const setString = Object.keys(fields)
        .map((key, index) => `"${key}"=$${index + 1}`)
        .join(', ');

    if (!setString) {
        throw new Error('No fields provided for update');
    }

    try {
        const { rows: [updatedVideoGame] } = await client.query(`
            UPDATE videoGames
            SET ${setString}
            WHERE id=$${Object.keys(fields).length + 1}
            RETURNING *;
        `, [...Object.values(fields), id]);
        return updatedVideoGame;
    } catch (error) {
        throw new Error("Error in updateVideoGame: " + error.message);
    }
}

// Deletes a video game by its ID
async function deleteVideoGame(req, res) {
    const videoGameId = req.params.id; // Assuming you get the video game ID from the request parameters

    try {
        const deletedVideoGame = await deleteVideoGame(videoGameId);

        if (deletedVideoGame) {
            // The video game was successfully deleted
            res.status(200).json({ message: 'Video game deleted successfully' });
        } else {
            // If deleteVideoGame returns falsy, it means the video game was not found
            res.status(404).json({ message: 'Video game not found' });
        }
    } catch (error) {
        console.error('Error deleting video game:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}



module.exports = {
    getAllVideoGames,
    getVideoGameById,
    createVideoGame,
    updateVideoGame,
    deleteVideoGame
}

