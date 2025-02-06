<script>
  import { onMount } from 'svelte';
  import { createNoise2D } from 'simplex-noise';
  import alea from 'alea';
  import { spline } from '$/utils/spline';

  let {
    class: className,
    hue = 0,
    animate = true,
    seed = (Math.random() + 1).toString(36).substring(7),
  } = $props();

  const numPoints = 12;
  const noiseStep = 0.003;
  const radius = 8;
  const noise2D = createNoise2D(alea(seed));

  let pathRef = $state();
  let startColour = $state();
  let stopColour = $state();
  let hueNoiseOffset = $state(hue);
  let animRef = $state();
  let points = $state(createPoints());

  function createPoints() {
    const points = [];
    const angleStep = (Math.PI * 2) / numPoints;
    const rad = 75;

    for (let i = 1; i <= numPoints; i++) {
      const theta = i * angleStep;

      const x = 100 + Math.cos(theta) * rad;
      const y = 100 + Math.sin(theta) * rad;

      points.push({
        x,
        y,
        originX: x,
        originY: y,
        noiseOffsetX: Math.random() * 1000,
        noiseOffsetY: Math.random() * 1000,
      });
    }

    return points;
  }

  function update() {
    if (!animate) return;
    pathRef.setAttribute('d', spline(points, 1, true));
    points.forEach((point) => {
      const nX = noise2D(point.noiseOffsetX, point.noiseOffsetX);
      const nY = noise2D(point.noiseOffsetY, point.noiseOffsetY);
      const x = map(nX, -1, 1, point.originX - radius, point.originX + radius);
      const y = map(nY, -1, 1, point.originY - radius, point.originY + radius);
      point.x = x;
      point.y = y;
      point.noiseOffsetX += noiseStep;
      point.noiseOffsetY += noiseStep;
    });
    const hueNoise = noise2D(hueNoiseOffset, hueNoiseOffset);
    const hue = map(hueNoise, -1, 1, 0, 360);
    startColour = `hsl(${hue}, 100%, 75%)`;
    stopColour = `hsl(${hue + 120}, 100%, 75%)`;
    hueNoiseOffset += noiseStep / 6;
    animRef = requestAnimationFrame(update);
  }

  function map(n, start1, end1, start2, end2) {
    return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
  }

  onMount(() => {
    const hueNoise = noise2D(hueNoiseOffset, hueNoiseOffset);
    const hue = map(hueNoise, -1, 1, 0, 360);
    startColour = `hsl(${hue}, 100%, 75%)`;
    stopColour = `hsl(${hue + 120}, 100%, 75%)`;
    points.forEach((point) => {
      const nX = noise2D(point.noiseOffsetX, point.noiseOffsetX);
      const nY = noise2D(point.noiseOffsetY, point.noiseOffsetY);
      const x = map(nX, -1, 1, point.originX - radius, point.originX + radius);
      const y = map(nY, -1, 1, point.originY - radius, point.originY + radius);
      point.x = x;
      point.y = y;
      point.noiseOffsetX += noiseStep;
      point.noiseOffsetY += noiseStep;
    });
    pathRef.setAttribute('d', spline(points, 1, true));

    if (animate === true) {
      animRef = requestAnimationFrame(update);
    }

    return () => cancelAnimationFrame(animRef);
  });
</script>

<svg
  width="200"
  height="200"
  viewBox="-25 -25 250 250"
  class={[animate && 'rotate', className]}
>
  <defs>
    <radialGradient id={seed} cx="50%" cy="50%" r="50%">
      <stop offset="0%" style={`stop-color:${stopColour};stop-opacity:1.00"`} />
      <stop
        offset="200%"
        style={`stop-color:${startColour};stop-opacity:1.00"`}
      />
    </radialGradient>
  </defs>
  <path
    bind:this={pathRef}
    d="M166.73961596680817 25.52971290103035 C138.58778297766065 -6.349104841405673 26.757388738007215 37.95022801454031 3.550370950430292 73.59036054391505 C-7.006023013952966 89.80232208790603 3.192717457954714 134.00233485191964 13.583534662321767 150.32091531899886 C25.90550206726224 169.67233038630843 69.06010598166122 206.3031199129625 90.99857672812644 199.5940479099056 C136.3811550836372 185.71546040988355 198.1530993967026 61.1019867669163 166.73961596680817 25.52971290103035Z"
    stroke="none"
    fill={`url(#${seed})`}
  />
</svg>

<style>
  .rotate {
    animation-name: ani-rotate;
    animation-duration: 30s;
    animation-timing-function: linear;
    animation-delay: 0s;
    animation-iteration-count: infinite;
    animation-direction: normal;
    animation-fill-mode: none;
  }

  @keyframes ani-rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
