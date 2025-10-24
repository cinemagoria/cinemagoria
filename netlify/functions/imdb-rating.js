const { createClient } = require('@libsql/client');

exports.handler = async (event) => {
  const imdbId = event.path.split('/').pop();

  console.log('Netlify Function - IMDb ID:', imdbId);
  console.log('Netlify Function - URL exists:', !!process.env.IMDB_DB_URL);
  console.log('Netlify Function - Token exists:', !!process.env.IMDB_DB_TOKEN);

  if (!process.env.IMDB_DB_URL || !process.env.IMDB_DB_TOKEN) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ found: false, error: 'Database not configured' })
    };
  }

  try {
    const tursoClient = createClient({
      url: process.env.IMDB_DB_URL,
      authToken: process.env.IMDB_DB_TOKEN,
    });

    const result = await tursoClient.execute({
      sql: 'SELECT average_rating, num_votes FROM imdb_ratings WHERE tconst = ?',
      args: [imdbId]
    });

    if (result.rows && result.rows.length > 0) {
      const row = result.rows[0];
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          found: true,
          score: parseFloat(row.average_rating),
          votes: parseInt(row.num_votes)
        })
      };
    } else {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ found: false })
      };
    }
  } catch (error) {
    console.error('Netlify Function Error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ found: false, error: error.message })
    };
  }
};