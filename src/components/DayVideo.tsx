import { useState } from 'react';
import type { DayYoutubeVideo } from '../types';
import { youtubeEmbedUrl } from '../data/dayVideos';
import './DayVideo.css';

interface DayVideoProps {
  video: DayYoutubeVideo;
}

export default function DayVideo({ video }: DayVideoProps) {
  const [playing, setPlaying] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`;
  const watchUrl = `https://www.youtube.com/watch?v=${video.videoId}`;

  return (
    <section className="day-video" aria-label="Video vadba">
      <div className="day-video-header">
        <h3>Video vadba</h3>
        <p className="day-video-meta">
          {video.title}
          <span aria-hidden="true"> · </span>
          {video.channel}
        </p>
        {video.note && <p className="day-video-note">{video.note}</p>}
      </div>

      <div className="day-video-frame">
        {playing ? (
          <iframe
            src={`${youtubeEmbedUrl(video.videoId)}&autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <button
            type="button"
            className="day-video-poster"
            onClick={() => setPlaying(true)}
            aria-label={`Predvajaj: ${video.title}`}
          >
            <img src={thumb} alt="" width={480} height={360} />
            <span className="day-video-play" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <polygon points="8,5 19,12 8,19" />
              </svg>
            </span>
          </button>
        )}
      </div>

      <a className="day-video-link" href={watchUrl} target="_blank" rel="noopener noreferrer">
        Odpri na YouTube
      </a>
    </section>
  );
}
