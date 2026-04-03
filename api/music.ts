import YoutubeMusicApi from 'youtube-music-api';

const api = new YoutubeMusicApi();

export default async function handler(req: any, res: any) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
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
    await api.initalize();
    const result = await api.search(q, "song");
    
    // Process results to be clean
    const songs = result.content.map((song: any) => ({
      id: song.videoId,
      title: song.name,
      artist: song.artist?.name || song.artist?.[0]?.name || "Unknown Artist",
      album: song.album?.name || "Unknown Album",
      thumbnail: song.thumbnails?.[0]?.url || "",
      duration: song.duration,
      url: `https://music.youtube.com/watch?v=${song.videoId}`
    }));

    res.status(200).json(songs);
  } catch (error) {
    console.error("Music search failed:", error);
    res.status(500).json({ error: "Music search failed" });
  }
}
