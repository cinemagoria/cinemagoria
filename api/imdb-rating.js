const tursoClient = require('../services/turso');

module.exports = async (req, res) => {
  const imdbId = req.url.split('/').pop();

  res.setHeader('Content-Type', 'application/json');

  if (!tursoClient) {
    return res.end(JSON.stringify({ found: false, error: 'Database not configured' }));
  }

  try {
    const result = await tursoClient.execute({
      sql: 'SELECT average_rating, num_votes FROM imdb_ratings WHERE tconst = ?',
      args: [imdbId]
    });

    if (result.rows && result.rows.length > 0) {
      const row = result.rows[0];
      res.end(JSON.stringify({
        found: true,
        score: parseFloat(row.average_rating),
        votes: parseInt(row.num_votes)
      }));
    } else {
      res.end(JSON.stringify({ found: false }));
    }
  } catch (error) {
    console.error('Error:', error);
    res.end(JSON.stringify({ found: false, error: error.message }));
  }
};