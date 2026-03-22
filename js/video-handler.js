/**
 * Video Handler Module
 * Forces video to play and keep looping.
 */

export function initVideoHandler() {
  const video = document.querySelector('.hero-video');

  if (video) {
    video.muted = true;

    const playVideo = () => {
      video.play().catch(() => {
        // Handle potential autoplay restrictions
      });
    };

    // Ensure it starts playing
    playVideo();

    // Additional event listeners for user interaction
    document.addEventListener('click', playVideo, { once: true });

    // Ensure it keeps playing if it gets paused for some reason
    video.addEventListener('pause', () => {
      video.play().catch(() => {});
    });

    // Loop handling
    video.addEventListener('ended', () => {
      video.currentTime = 0;
      video.play().catch(() => {});
    });
  }
}
