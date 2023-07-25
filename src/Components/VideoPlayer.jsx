import React, { useRef, useState } from 'react';
import { GrChapterPrevious, GrChapterNext, GrPlay, GrPause, GrVolume } from 'react-icons/gr';
import { RiFullscreenFill } from 'react-icons/ri';
import './videoPlayer.css';

export default function () {
    const videoIdx = useRef(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [showVolume, setShowVolume] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [showIconOnVideo, setShowIconOnVideo] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const videoRef = useRef();
    const videos = ['./videos/video-1.mp4', './videos/video-2.mp4', './videos/video-3.mp4'];

    const handleChangeVideo = (type) => {
        setIsPlaying(false);
        const video = videoRef.current;
        if (type === 'NEXT') {
            if (videos.length - 1 === videoIdx.current) {
                videoIdx.current = 0;
                video.src = videos[videoIdx.current];
            } else {
                videoIdx.current = videoIdx.current + 1;
                video.src = videos[videoIdx.current];
            }
        } else {
            if (videoIdx.current === 0) {
                videoIdx.current = videos.length - 1;
                video.src = videos[videoIdx.current];
            } else {
                videoIdx.current = videoIdx.current - 1;
                video.src = videos[videoIdx.current];
            }
        }
    };

    const togglePlayPause = () => {
        const video = videoRef.current;
        setShowIconOnVideo(true);
        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }

        if (!isPlaying) {
            setTimeout(() => {
                setShowIconOnVideo(false);
            }, [2000])
        }

    };

    const handleVolumeChange = (e) => {
        const video = videoRef.current;
        const userSelectedVolume = parseFloat(e.target.value);
        if (userSelectedVolume === 0) {
            video.volume = 0;
            setVolume(userSelectedVolume);
            return;
        }
        setVolume(userSelectedVolume);
        video.volume = userSelectedVolume;
    };

    const toggleFullScreen = () => {
        const video = videoRef.current;
        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen();
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
        } else if (video.msRequestFullscreen) {
            video.msRequestFullscreen();
        }

    };

    const handleTimeUpdate = () => {
        setCurrentTime(videoRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
        setDuration(videoRef.current.duration);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div id='video-player'>
            <button
                className={showIconOnVideo ? 'pause-play-button show' : 'pause-play-button'}
                onClick={togglePlayPause}>
                {isPlaying ? <GrPause /> : <GrPlay />}
            </button>
            <video
                ref={videoRef}
                id='video-displayer'
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
            >
                <source src={videos[videoIdx.current]} />
            </video>

            <div id="control-box">
                <div id='control-box-left'>
                    <button onClick={() => handleChangeVideo('PREVIOUS')}><GrChapterPrevious /></button>
                    <button onClick={togglePlayPause}>{isPlaying ? <GrPause /> : <GrPlay />}</button>
                    <button onClick={() => handleChangeVideo('NEXT')}><GrChapterNext /></button>
                </div>
                <div id='control-box-right'>
                    <button onClick={() => setShowVolume(!showVolume)}><GrVolume /></button>
                    {
                        showVolume ? (<input
                            type="range"
                            id="volume-range"
                            name="volume"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={handleVolumeChange}
                        />) : null
                    }
                    <button onClick={toggleFullScreen}><RiFullscreenFill /></button>
                </div>
            </div>
            <div id='video-timeline'>
                <input
                    type="range"
                    id='video-timeline-range'
                    min={0}
                    max={duration}
                    step={1}
                    value={currentTime}
                    onChange={(e) => {
                        videoRef.current.currentTime = e.target.value;
                    }}
                />
                <span>{formatTime(currentTime)}/{formatTime(duration)}</span>
            </div>
        </div>
    )
}
