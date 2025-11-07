const { chatDbClient } = require('../services/turso');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  if (req.method !== 'GET') {
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const userId = url.searchParams.get('user_id');

  console.log('[API] user-conversations called with user_id:', userId);

  if (!userId) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ error: 'user_id parameter required' }));
  }

  if (!chatDbClient) {
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'Database not configured' }));
  }

  try {
    const result = await chatDbClient.execute({
      sql: `SELECT DISTINCT chat_id, MAX(created_at) as last_message 
            FROM chat_interactions 
            WHERE user_id = ? 
            GROUP BY chat_id 
            ORDER BY last_message DESC 
            LIMIT 50`,
      args: [userId]
    });

    const conversations = result.rows.map(row => ({
      chat_id: row.chat_id,
      last_message: row.last_message
    }));

    res.statusCode = 200;
    res.end(JSON.stringify({ 
      success: true,
      conversations 
    }));

  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({ 
      success: false,
      error: error.message 
    }));
  }
};