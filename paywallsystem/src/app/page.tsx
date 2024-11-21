'use client';

import React, { useEffect, useState } from 'react';

type Video = {
  guid: string;
  title: string;
  videoLibraryId: string;
  playbackUrl: string; // HLS or direct streaming URL
};

const Home: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch videos data from backend
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/streams'); // Backend endpoint
        if (response.ok) {
          const data = await response.json();
          setVideos(data.videos || []); // Assuming 'videos' is the key in the response
        } else {
          setError('Failed to fetch videos from the server');
        }
      } catch (error) {
        setError('Error fetching videos. Please try again later.');
        console.error('Error fetching videos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-2xl font-bold mb-6">All Videos</h1>
      {loading ? (
        <p className="text-center">Loading videos...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.guid} className="video-card shadow-md p-4 rounded-md">
              <iframe
                width="100%"
                height="300px"
                src={`https://iframe.mediadelivery.net/embed/${video.videoLibraryId}/${video.guid}?autoplay=0`} // BunnyCDN iframe embed URL
                frameBorder="0"
                allow="autoplay; fullscreen"
                title={`Video: ${video.title}`}
                className="rounded-md"
              ></iframe>
              <p className="text-center mt-2 font-medium">{video.title}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center">No videos available</p>
      )}
    </div>
  );
};

export default Home;
