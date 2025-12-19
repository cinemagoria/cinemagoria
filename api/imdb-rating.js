const { createClient } = require('@libsql/client');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  const imdbId = req.url.split('/').pop();

  if (!process.env.IMDB_DB_URL || !process.env.IMDB_DB_TOKEN) {
    console.error('Missing Turso DB credentials');
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ found: false, error: 'Database configuration missing' }));
    return;
  }

  const client = createClient({
    url: process.env.IMDB_DB_URL,
    authToken: process.env.IMDB_DB_TOKEN,
  });

  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('timeout')), 5000)
  );

  try {
    const query = client.execute({
      sql: 'SELECT average_rating, num_votes FROM imdb_ratings WHERE tconst = ? LIMIT 1',
      args: [imdbId]
    });

    const result = await Promise.race([query, timeout]);

    if (result.rows && result.rows.length > 0) {
      const row = result.rows[0];
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        found: true,
        score: parseFloat(row.average_rating),
        votes: parseInt(row.num_votes),
        source: 'imdb'
      }));
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ found: false, source: 'tmdb' }));
    }
  } catch (error) {
    console.error('Error in imdb-rating function:', error);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ found: false, source: 'tmdb', error: error.message }));
  }
};