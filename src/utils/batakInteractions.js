/**
 * batakInteractions.js
 * Advanced Interactive JavaScript features for the Bright Batak Royal Wedding Theme
 */

import confetti from 'canvas-confetti';

/**
 * 1. Shimmer Beam on Ulos Ribbon Dividers
 * Sweeps a golden metallic ray across the woven Ulos tapestry when scrolled into view.
 */
export function initUlosShimmer() {
  if (typeof window === 'undefined') return;

  const ribbons = document.querySelectorAll('.ulos-ribbon-wrapper');
  if (!ribbons.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('shimmer-active');
        // Re-trigger every time it comes back into view
        const beam = entry.target.querySelector('.ulos-shimmer-beam');
        if (beam) {
          beam.style.animation = 'none';
          // Trigger reflow
          void beam.offsetWidth;
          beam.style.animation = 'ulosShimmerSweep 2.2s cubic-bezier(0.4, 0, 0.2, 1) forwards';
        }
      }
    });
  }, { threshold: 0.25 });

  ribbons.forEach(r => observer.observe(r));

  return () => observer.disconnect();
}

/**
 * 2. 3D Tilt & Parallax Physics for Cards & Monogram Crest
 * Adds subtle gyroscope & mouse move 3D depth with specular reflection.
 */
export function attach3DParallaxTilt(element, maxAngle = 8) {
  if (!element) return () => {};

  let isHovered = false;

  const onMouseMove = (e) => {
    if (!isHovered) return;
    const rect = element.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxAngle;
    const rotateY = ((x - centerX) / centerX) * maxAngle;

    element.style.transform = `perspective(900px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px) scale3d(1.02, 1.02, 1.02)`;
  };

  const onMouseEnter = () => {
    isHovered = true;
    element.style.transition = 'transform 0.15s ease-out, box-shadow 0.25s ease';
  };

  const onMouseLeave = () => {
    isHovered = false;
    element.style.transition = 'transform 0.5s ease-out, box-shadow 0.5s ease';
    element.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)';
  };

  element.addEventListener('mouseenter', onMouseEnter);
  element.addEventListener('mousemove', onMouseMove);
  element.addEventListener('mouseleave', onMouseLeave);

  return () => {
    element.removeEventListener('mouseenter', onMouseEnter);
    element.removeEventListener('mousemove', onMouseMove);
    element.removeEventListener('mouseleave', onMouseLeave);
  };
}

/**
 * 3. 3D Wax Seal Stamp Release Animation + Shockwave Burst
 * Realistic wax stamp pressure compression + gold pulse ripple + Batak luxury confetti.
 */
export function triggerWaxSealStampRelease(sealElement, onComplete) {
  if (!sealElement) {
    if (onComplete) onComplete();
    return;
  }

  // 1. Audio-haptic visual compression
  sealElement.classList.add('seal-pressed');

  // 2. Spawn gold ripple ring
  const ring = document.createElement('div');
  ring.className = 'seal-shockwave-ring';
  sealElement.appendChild(ring);

  // 3. Batak Luxury Confetti (Gold, Crimson Red, Champagne Rose)
  const rect = sealElement.getBoundingClientRect();
  const originX = (rect.left + rect.width / 2) / window.innerWidth;
  const originY = (rect.top + rect.height / 2) / window.innerHeight;

  setTimeout(() => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { x: originX, y: originY },
      colors: ['#D4AF37', '#FFF3D4', '#B91C1C', '#E2BD75', '#8A6324'],
      ticks: 200,
      gravity: 0.9,
      scalar: 1.1,
      shapes: ['circle']
    });

    // Secondary soft petals burst
    confetti({
      particleCount: 30,
      spread: 90,
      origin: { x: originX, y: originY },
      colors: ['#E8D5B7', '#FCE7F3', '#B91C1C'],
      ticks: 240,
      gravity: 0.6,
      scalar: 1.4,
      shapes: ['square']
    });

    sealElement.classList.remove('seal-pressed');
    sealElement.classList.add('seal-released');

    setTimeout(() => {
      if (ring.parentNode) ring.parentNode.removeChild(ring);
      if (onComplete) onComplete();
    }, 450);
  }, 220);
}

/**
 * 4. Daylight Floating Gold Sparkles & Champagne Petals
 * Spawns an ethereal light-themed floating particle effect.
 */
export function initDaylightFloatingParticles(containerElement, count = 28) {
  if (!containerElement) return () => {};

  containerElement.innerHTML = '';
  const colors = [
    'rgba(212, 175, 55, 0.7)',   // 24K Gold
    'rgba(201, 169, 110, 0.6)',  // Warm Gold
    'rgba(185, 28, 28, 0.45)',   // Batak Crimson Red
    'rgba(255, 243, 212, 0.8)',  // Champagne Ivory
    'rgba(232, 213, 183, 0.6)'   // Soft Alabaster
  ];

  const particles = [];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'daylight-particle';
    const isPetal = i % 3 === 0;
    
    if (isPetal) {
      el.classList.add('daylight-petal');
      const size = 10 + Math.random() * 8;
      el.style.width = `${size}px`;
      el.style.height = `${size * 1.3}px`;
      el.style.background = Math.random() > 0.4 ? 'rgba(212, 175, 55, 0.65)' : 'rgba(185, 28, 28, 0.45)';
    } else {
      const size = 3 + Math.random() * 5;
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
    }

    el.style.left = `${Math.random() * 100}%`;
    el.style.top = `${-10 - Math.random() * 20}%`;
    el.style.animationDuration = `${7 + Math.random() * 9}s`;
    el.style.animationDelay = `${Math.random() * 8}s`;

    containerElement.appendChild(el);
    particles.push(el);
  }

  return () => {
    particles.forEach(p => p.remove());
  };
}


/**
 * 6. Interactive Cursor / Touch Trail (Golden Batak Sparkles)
 * Dispatches gentle glowing star particles along mouse & touch coordinates.
 */
export function initBatakCursorTrail() {
  if (typeof window === 'undefined') return () => {};

  let lastTime = 0;

  const handleMove = (e) => {
    const now = Date.now();
    if (now - lastTime < 45) return; // 22fps throttle for silky-smooth performance
    lastTime = now;

    const x = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : null);
    const y = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : null);
    if (x === null || y === null) return;

    const star = document.createElement('div');
    star.className = 'batak-cursor-sparkle';
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;

    const tx = (Math.random() - 0.5) * 30;
    const ty = (Math.random() - 0.5) * 30;
    star.style.setProperty('--tx', `${tx}px`);
    star.style.setProperty('--ty', `${ty}px`);

    document.body.appendChild(star);

    setTimeout(() => {
      if (star.parentNode) star.parentNode.removeChild(star);
    }, 750);
  };

  window.addEventListener('mousemove', handleMove, { passive: true });
  window.addEventListener('touchmove', handleMove, { passive: true });

  return () => {
    window.removeEventListener('mousemove', handleMove);
    window.removeEventListener('touchmove', handleMove);
  };
}
