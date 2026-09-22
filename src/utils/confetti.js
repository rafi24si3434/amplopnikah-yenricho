import confetti from 'canvas-confetti';

/**
 * Luxury Wedding Confetti Burst:
 * Kombinasi serpihan emas murni dan kelopak bunga mawar merah/pink
 * yang meluncur lembut menyambut tamu saat segel amplop dibuka.
 */
export function triggerLuxuryWeddingConfetti() {
  const count = 90;
  const defaults = {
    origin: { y: 0.68 },
    zIndex: 99999,
    disableForReducedMotion: true
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  // 1. Ledakan Berkilau Emas & Permata dari Titik Segel Lilin (Wax Seal)
  fire(0.25, {
    spread: 35,
    startVelocity: 50,
    colors: ['#D4AF37', '#FFD700', '#F3E5AB', '#FFFFFF']
  });

  fire(0.2, {
    spread: 65,
    colors: ['#C9A96E', '#E8D5B7', '#B72E44']
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.95,
    colors: ['#D4AF37', '#B72E44', '#E8A598', '#FFDF73']
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 28,
    decay: 0.92,
    colors: ['#C9A96E', '#721B2A']
  });

  fire(0.1, {
    spread: 130,
    startVelocity: 42,
    colors: ['#FFD700', '#D94A6B', '#FFFFFF']
  });

  // 2. Taburan Lembut Kelopak Mawar & Serpihan Daun Emas (Rain of Petals & Gold Leaf)
  const duration = 3800;
  const end = Date.now() + duration;

  const interval = setInterval(() => {
    if (Date.now() > end) {
      return clearInterval(interval);
    }

    // Meriam Kiri (Meluncur ke arah tengah)
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: ['#B72E44', '#D94A6B', '#D4AF37', '#C9A96E', '#E8A598'],
      scalar: 1.25,
      drift: 0.15,
      gravity: 0.65,
      ticks: 220,
      zIndex: 99999
    });

    // Meriam Kanan (Meluncur ke arah tengah)
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: ['#B72E44', '#D94A6B', '#D4AF37', '#C9A96E', '#E8A598'],
      scalar: 1.25,
      drift: -0.15,
      gravity: 0.65,
      ticks: 220,
      zIndex: 99999
    });

    // Hujan Kelopak Mawar Lembut dari Langit Atas Layar
    confetti({
      particleCount: 2,
      angle: 90,
      spread: 90,
      origin: { x: Math.random(), y: -0.05 },
      colors: ['#B72E44', '#D94A6B', '#C9A96E', '#721B2A', '#F3E5AB'],
      scalar: 1.35,
      gravity: 0.55,
      drift: (Math.random() - 0.5) * 0.4,
      ticks: 260,
      zIndex: 99999
    });
  }, 110);
}
