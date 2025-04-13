import confetti from "canvas-confetti";

export function fireConfetti() {
  confetti({
    particleCount: 50,
    spread: 70,
    origin: { y: 0.6 },
  });
}
