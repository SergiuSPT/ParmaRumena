import { useId, useSyncExternalStore } from "react";

const motionQuery = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (callback: () => void) => {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};

type Vector = [number, number, number];
const add = (a: Vector, b: Vector): Vector => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (a: Vector, n: number): Vector => [a[0] * n, a[1] * n, a[2] * n];
const dot = (a: Vector, b: Vector) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (a: Vector) => scale(a, 1 / Math.hypot(...a));
const cross = (a: Vector, b: Vector): Vector => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

// Truncate an icosahedron into the football's 12 pentagons and 20 hexagons.
const phi = (1 + Math.sqrt(5)) / 2;
const vertices: Vector[] = [];
for (const a of [-1, 1]) for (const b of [-phi, phi]) {
  vertices.push([0, a, b], [a, b, 0], [b, 0, a]);
}
const neighbors = vertices.map((v, i) => vertices.flatMap((w, j) =>
  i !== j && Math.abs(Math.hypot(...add(v, scale(w, -1))) - 2) < 0.001 ? [j] : []));
const cut = (i: number, j: number) => unit(add(scale(vertices[i], 2 / 3), scale(vertices[j], 1 / 3)));
const panels: { dark: boolean; points: Vector[] }[] = vertices.map((v, i) => {
  const normal = unit(v);
  const axis = unit(cross(normal, [1, 0, 0]));
  const tangent = cross(normal, axis);
  const points = neighbors[i].map((j) => cut(i, j));
  points.sort((a, b) => Math.atan2(dot(a, tangent), dot(a, axis)) - Math.atan2(dot(b, tangent), dot(b, axis)));
  return { dark: true, points };
});
for (let i = 0; i < vertices.length; i++) for (const j of neighbors[i]) for (const k of neighbors[j]) {
  if (i < j && j < k && neighbors[k].includes(i)) {
    panels.push({ dark: false, points: [cut(i, j), cut(j, i), cut(j, k), cut(k, j), cut(k, i), cut(i, k)] });
  }
}

const Football = ({ rotation }: { rotation: number }) => {
  const id = useId();
  const reducedMotion = useSyncExternalStore(subscribeMotion, () => window.matchMedia(motionQuery).matches, () => false);
  const angle = (reducedMotion ? 12 : rotation) * Math.PI / 180;
  const rotate = ([x, y, z]: Vector): Vector => {
    const rx = x * Math.cos(angle) + z * Math.sin(angle);
    const rz = -x * Math.sin(angle) + z * Math.cos(angle);
    return [rx * Math.cos(-0.22) - y * Math.sin(-0.22), rx * Math.sin(-0.22) + y * Math.cos(-0.22), rz];
  };
  const faces = panels.map((panel, index) => {
    const center = rotate(unit(scale(panel.points.reduce(add, [0, 0, 0]), 1 / panel.points.length)));
    // Subdivide spherical edges so the silhouette stays round as the ball turns.
    const outline = panel.points.flatMap((point, i) => Array.from({ length: 8 }, (_, step) => {
      const next = panel.points[(i + 1) % panel.points.length];
      return rotate(unit(add(scale(point, 1 - step / 8), scale(next, step / 8))));
    }));
    const light = Math.max(0, dot(center, unit([-0.5, -0.7, 1])));
    return { index, depth: center[2], fill: panel.dark ? `hsl(220 24% ${9 + light * 12}%)` : `hsl(215 16% ${56 + light * 36}%)`, path: outline.map(([x, y], i) => `${i ? "L" : "M"}${250 + x * 238},${250 + y * 238}`).join(" ") + "Z" };
  }).sort((a, b) => a.depth - b.depth);

  return (
    <svg viewBox="0 0 500 500" className="matches-football" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-shade`} cx="32%" cy="25%" r="75%">
          <stop offset="0" stopColor="#fff" stopOpacity=".12" />
          <stop offset=".6" stopColor="#071223" stopOpacity="0" />
          <stop offset="1" stopColor="#020714" stopOpacity=".8" />
        </radialGradient>
        <clipPath id={`${id}-clip`}><circle cx="250" cy="250" r="238" /></clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        {faces.map((face) => <path key={face.index} d={face.path} fill={face.fill} stroke="#182230" strokeWidth="1.4" strokeLinejoin="round" />)}
        <circle cx="250" cy="250" r="238" fill={`url(#${id}-shade)`} />
      </g>
    </svg>
  );
};

export default Football;
