"use client";

import Image from "next/image";
import { type MouseEvent, useEffect, useRef, useState } from "react";

type ProductDemoPlayerProps = {
  source: string;
  poster: string;
  title: string;
  posterAlt: string;
  playLabel: string;
  loadingLabel: string;
  errorLabel: string;
  retryLabel: string;
  fallbackLabel: string;
  durationLabel: string;
  width: number;
  height: number;
};

export function ProductDemoPlayer({
  source,
  poster,
  title,
  posterAlt,
  playLabel,
  loadingLabel,
  errorLabel,
  retryLabel,
  fallbackLabel,
  durationLabel,
  width,
  height,
}: ProductDemoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playRequestRef = useRef(0);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (started) videoRef.current?.focus();
  }, [started]);

  function play() {
    const video = videoRef.current;
    if (!video) return;
    const request = ++playRequestRef.current;
    setFailed(false);
    setLoading(true);
    setStarted(true);
    // Attach the source inside the user gesture: no media request on page load,
    // and native playback retains user activation on mobile browsers.
    video.src = source;
    video.load();
    if (started) video.focus();
    void video.play().catch((error: unknown) => {
      if (request !== playRequestRef.current) return;
      setLoading(false);
      if (error instanceof DOMException && error.name === "AbortError") return;
      setFailed(true);
    });
  }

  function activate(event: MouseEvent<HTMLAnchorElement>) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    play();
  }

  return (
    <div className="q-demo-player" data-demo-started={started}>
      <div className="q-demo-frame">
        {!started && (
          <>
            <Image
              className="q-demo-poster"
              src={poster}
              alt={posterAlt}
              width={width}
              height={height}
              sizes="(max-width: 760px) calc(100vw - 36px), 1100px"
              fetchPriority="low"
            />
            <a className="q-demo-play" href={source} onClick={activate}>
              <span className="q-demo-play-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 12 14"
                  width="10"
                  height="12"
                  aria-hidden="true"
                >
                  <path d="M1 1L11 7L1 13Z" fill="currentColor" />
                </svg>
              </span>
              <span>{playLabel}</span>
              <span className="q-demo-play-time">{durationLabel}</span>
            </a>
          </>
        )}
        {/* biome-ignore lint/a11y/useMediaCaption: This video has no audio; a complete localized text alternative is directly below it. */}
        <video
          ref={videoRef}
          hidden={!started}
          className="q-demo-video"
          controls={started}
          playsInline
          preload="none"
          width={width}
          height={height}
          poster={started ? poster : undefined}
          aria-label={title}
          aria-describedby="product-demo-transcript"
          tabIndex={0}
          onPlaying={() => setLoading(false)}
          onWaiting={() => setLoading(true)}
          onPause={() => setLoading(false)}
          onEnded={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setFailed(true);
          }}
        />
      </div>
      {loading && !failed && (
        <p className="q-demo-status" role="status">
          {loadingLabel}
        </p>
      )}
      {failed && (
        <div className="q-demo-error">
          <p role="alert">{errorLabel}</p>
          <div>
            <button type="button" onClick={play}>
              {retryLabel}
            </button>
            <a href={source}>{fallbackLabel}</a>
          </div>
        </div>
      )}
    </div>
  );
}
