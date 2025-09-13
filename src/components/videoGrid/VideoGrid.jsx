import VideoCard from "../videoСard/VideoCard";

const VideoGrid = ({ videos, onSelect }) => {
  return (
    <div className="video-grid">
      {videos.slice(0, 12).map((movie) => (
        <VideoCard key={movie.id} movie={movie} onClick={onSelect} />
      ))}
    </div>
  );
};

export default VideoGrid;
