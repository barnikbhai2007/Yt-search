import ytSearch from 'yt-search';

export default async function handler(req: any, res: any) {
  // Add CORS headers so the user can call this API from their main website
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const q = req.query.q;

  if (!q) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    console.log(`Searching for: ${q}`);
    const result = await ytSearch(q);
    
    if (!result || !result.videos) {
      console.error("No videos found in result:", result);
      return res.status(200).json([]);
    }

    console.log(`Found ${result.videos.length} videos`);
    
    // Get the top 10 video results
    const videos = result.videos.slice(0, 10).map((vid: any) => ({
      id: vid.videoId,
      title: vid.title,
      thumbnail: vid.thumbnail,
      url: vid.url,
      duration: vid.timestamp,
      author: vid.author.name
    }));

    res.status(200).json(videos);
  } catch (error) {
    console.error("Search failed:", error);
    res.status(500).json({ error: "Search failed" });
  }
}
