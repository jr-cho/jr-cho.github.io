// Simplified particle background for mobile performance
const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");
let shapes = [];
let animationId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function initShapes() {
  shapes = [];
  const count = window.innerWidth < 768 ? 15 : 25; // Fewer particles on mobile

  for (let i = 0; i < count; i++) {
    shapes.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 1 + Math.random() * 2,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.3,
    });
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw particles
  for (let shape of shapes) {
    ctx.beginPath();
    ctx.arc(shape.x, shape.y, shape.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${shape.opacity})`;
    ctx.fill();

    shape.x += shape.dx;
    shape.y += shape.dy;

    if (shape.x < 0 || shape.x > canvas.width) shape.dx *= -1;
    if (shape.y < 0 || shape.y > canvas.height) shape.dy *= -1;
  }

  animationId = requestAnimationFrame(animate);
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "-50px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll(".fade-in").forEach((el) => {
  observer.observe(el);
});

// Sticky navigation
const stickyNav = document.getElementById("stickyNav");

window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > 100) {
    stickyNav.classList.add("visible");
  } else {
    stickyNav.classList.remove("visible");
  }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Back to top button
const backToTopBtn = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backToTopBtn.style.opacity = "1";
    backToTopBtn.style.pointerEvents = "auto";
  } else {
    backToTopBtn.style.opacity = "0";
    backToTopBtn.style.pointerEvents = "none";
  }
});

backToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Fetch GitHub Stats
async function fetchGitHubStats() {
  try {
    // Fetch public GitHub user data (no auth needed for public info)
    const response = await fetch('https://api.github.com/users/jr-cho');
    if (response.ok) {
      const data = await response.json();
      
      // Update stats with real data
      document.getElementById('repos-count').textContent = data.public_repos || '12';
      document.getElementById('followers-count').textContent = data.followers || '15';
      
      // Calculate languages count (estimate based on repos)
      if (data.public_repos > 0) {
        document.getElementById('languages-count').textContent = Math.min(data.public_repos, 8);
      }
      
      // Update mobile stats as well
      document.getElementById('repos-count-mobile').textContent = data.public_repos || '12';
      document.getElementById('followers-count-mobile').textContent = data.followers || '15';
      if (data.public_repos > 0) {
        document.getElementById('languages-count-mobile').textContent = Math.min(data.public_repos, 8);
      }
    }
  } catch (error) {
    console.log('GitHub API unavailable, using fallback stats');
    // Keep the default values if API fails
  }
}

// Initialize
resizeCanvas();
initShapes();
animate();
fetchGitHubStats(); // Fetch real GitHub stats

// Handle resize
window.addEventListener("resize", () => {
  resizeCanvas();
  initShapes();
});

// Pause animation when tab is not visible (performance optimization)
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(animationId);
  } else {
    animate();
  }
}); 