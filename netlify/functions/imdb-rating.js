const { createClient } = require('@libsql/client');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const imdbId = event.path.split('/').pop();

  if (!imdbId?.startsWith('tt')) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ found: false, source: 'tmdb' }),
    };
  }

  if (!process.env.IMDB_DB_URL || !process.env.IMDB_DB_TOKEN) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ found: false, source: 'tmdb' })
    };
  }

  try {
    const client = createClient({
      url: process.env.IMDB_DB_URL,
      authToken: process.env.IMDB_DB_TOKEN,
    });

    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('timeout')), 3000)
    );

    const query = client.execute({
      sql: 'SELECT average_rating, num_votes FROM imdb_ratings WHERE tconst = ? LIMIT 1',
      args: [imdbId]
    });

    const result = await Promise.race([query, timeout]);

    if (result.rows?.length > 0) {
      const row = result.rows[0];
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          found: true,
          score: parseFloat(row.average_rating),
          votes: parseInt(row.num_votes),
          source: 'imdb'
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ found: false, source: 'tmdb' }),
    };
  } catch (error) {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ found: false, source: 'tmdb' }),
    };
  }
};