const client = require('./client');
//const { createBoardGame } = require('./your-module');

// Retrieves all board games from the database
async function getAllBoardGames() {
    try {
        const { rows } = await client.query('SELECT * FROM boardgames;');
        return rows;
    } catch (error) {
        console.error('Error in getAllBoardGames:', error);
        throw error;
    }
}

// Fetches a single board game by its ID
async function getBoardGameById(id) {
    try {
        const { rows } = await client.query('SELECT * FROM boardgames WHERE id = $1;', [id]);
        return rows[0];
    } catch (error) {
        console.error('Error in getBoardGameById:', error);
        throw error;
    }
}

// Validates the board game data
function validateBoardGameData(data) {
    // Define required fields and their expected types
    const requiredFields = {
        name: 'string',
        description: 'string',
        price: 'number',
        inStock: 'boolean',
        isPopular: 'boolean',
        imgUrl: 'string'
    };

    for (const field in requiredFields) {
        if (!data.hasOwnProperty(field) || typeof data[field] !== requiredFields[field]) {
            throw new Error(`Invalid or missing field: ${field}`);
        }
    }
}

// Creates a new board game with provided details
async function createBoardGame({ name, description, price, inStock, isPopular, imgUrl }) {
    // Validate input data
    validateBoardGameData({ name, description, price, inStock, isPopular, imgUrl });

    try {
        const { rows } = await client.query(
            'INSERT INTO boardgames(name, description, price, "inStock", "isPopular", "imgUrl") VALUES($1, $2, $3, $4, $5, $6) RETURNING *;',
            [name, description, price, inStock, isPopular, imgUrl]
        );
        return rows[0];
    } catch (error) {
        console.error('Error in createBoardGame:', error);
        throw error;
    }
}

// Updates a board game's details by its ID
async function updateBoardGame(id, fields = {}) {
    // Validate update fields
    if (Object.keys(fields).length === 0) {
        throw new Error('No fields provided for update');
    }
    validateBoardGameData(fields);

    const setString = Object.keys(fields)
        .map((key, index) => `"${key}"=$${index + 1}`)
        .join(', ');

    try {
        const { rows } = await client.query(
            `UPDATE boardgames SET ${setString} WHERE id=$${Object.keys(fields).length + 1} RETURNING *;`,
            [...Object.values(fields), id]
        );
        return rows[0];
    } catch (error) {
        console.error('Error in updateBoardGame:', error);
        throw error;
    }
}

// Deletes a board game by its ID
async function deleteBoardGame(id) {
    try {
        const { rows } = await client.query('DELETE FROM boardgames WHERE id=$1 RETURNING *;', [id]);
        return rows[0];
    } catch (error) {
        console.error('Error in deleteBoardGame:', error);
        throw error;
    }
}

module.exports = {
    getAllBoardGames,
    getBoardGameById,
    createBoardGame,
    updateBoardGame,
    deleteBoardGame
};
