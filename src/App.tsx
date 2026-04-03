/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Youtube, Music, Loader2, ExternalLink, Play } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  duration: string;
  author: string;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  thumbnail: string;
  duration: string;
  url: string;
}

export default function App() {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const [musicResults, setMusicResults] = useState<Song[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchType, setSearchType] = useState<'video' | 'music'>('video');
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    
    setIsSearching(true);
    setError('');
    setSearchResults([]);
    setMusicResults([]);

    try {
      const endpoint = searchType === 'video' ? '/search' : '/music';
      const response = await fetch(`${endpoint}?q=${encodeURIComponent(searchInput)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const results = await response.json();
      if (searchType === 'video') {
        setSearchResults(results);
      } else {
        setMusicResults(results);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setError('Failed to fetch results. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Youtube className="w-8 h-8 text-red-600" />
            <h1 className="text-xl font-bold tracking-tight">YT Search API</h1>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setSearchType('video')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                searchType === 'video' 
                  ? 'bg-white text-red-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Videos
            </button>
            <button
              onClick={() => setSearchType('music')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                searchType === 'music' 
                  ? 'bg-white text-red-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Music
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Test the {searchType === 'video' ? 'Video' : 'Music'} API
          </h2>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {searchType === 'video' ? (
                  <Search className="h-5 w-5 text-gray-400" />
                ) : (
                  <Music className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors"
                placeholder={`Search YouTube ${searchType === 'video' ? 'videos' : 'music'}...`}
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !searchInput.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
            </button>
          </form>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            {(searchResults.length > 0 || musicResults.length > 0) ? 'Results' : 'No results yet'}
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchType === 'video' ? (
              searchResults.map((video) => (
                <a 
                  key={video.id} 
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-video bg-gray-100 overflow-hidden">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-red-600 transition-colors">
                      {video.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-auto flex items-center justify-between">
                      <span>{video.author}</span>
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </p>
                  </div>
                </a>
              ))
            ) : (
              musicResults.map((song) => (
                <a 
                  key={song.id} 
                  href={song.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    <img 
                      src={song.thumbnail} 
                      alt={song.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-12 h-12 text-white fill-current" />
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="font-medium text-gray-900 line-clamp-1 mb-1 group-hover:text-red-600 transition-colors">
                      {song.title}
                    </h4>
                    <p className="text-sm text-gray-700 font-medium line-clamp-1">
                      {song.artist}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                      {song.album}
                    </p>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
        
        <div className="mt-12 bg-gray-900 rounded-xl p-6 text-gray-300 shadow-lg">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            API Usage Instructions
          </h3>
          <p className="text-sm mb-4">
            You now have two clean Vercel endpoints:
          </p>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase">YouTube Video Search</p>
              <div className="bg-black rounded-lg p-4 font-mono text-sm overflow-x-auto border border-gray-800">
                <span className="text-blue-400">const</span> response = <span className="text-blue-400">await</span> fetch(<span className="text-green-400">'https://yt-search-nine.vercel.app/search?q=your+query'</span>);
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase">YouTube Music Search</p>
              <div className="bg-black rounded-lg p-4 font-mono text-sm overflow-x-auto border border-gray-800">
                <span className="text-blue-400">const</span> response = <span className="text-blue-400">await</span> fetch(<span className="text-green-400">'https://yt-search-nine.vercel.app/music?q=your+query'</span>);
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
