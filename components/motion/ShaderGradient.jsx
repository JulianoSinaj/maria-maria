"use client";
import { useEffect, useRef } from "react";

/* Lightweight WebGL shader gradient — a slowly flowing, scroll-reactive colour
   field in brand tones. No three.js: a single fullscreen triangle + fbm noise.
   Renders a static CSS gradient when WebGL is unavailable or motion is reduced. */

const PALETTES = {
  // warm ivory → champagne → terracotta dawn (light heroes)
  dawn: ["#F7F2E7", "#EAD9B0", "#D8A97E", "#B47560"],
  // deep cellar bordeaux with a champagne glow (dark CTA bands)
  wine: ["#2A070D", "#54101B", "#8A2B2F", "#C8B77A"],
  // olive vineyard greens with golden light
  vigna: ["#EFEAD8", "#CFC79A", "#8E9A63", "#5F6F43"],
  // ivory → mint → deep teal, the Falanghina label accent (light heroes/bands)
  mare: ["#F2F6F1", "#D3E9E1", "#8FCDBD", "#35907F"],
};

const FALLBACK = {
  dawn: "linear-gradient(120deg,#F7F2E7 0%,#EAD9B0 38%,#D8A97E 68%,#B47560 100%)",
  wine: "linear-gradient(130deg,#2A070D 0%,#54101B 42%,#8A2B2F 74%,#5E3A2A 100%)",
  vigna: "linear-gradient(150deg,#EFEAD8 0%,#CFC79A 40%,#8E9A63 72%,#5F6F43 100%)",
  mare: "linear-gradient(140deg,#F2F6F1 0%,#D3E9E1 38%,#8FCDBD 70%,#35907F 100%)",
};

const VERT = `
attribute vec2 a;
void main(){ gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_res;
uniform float u_time;
uniform float u_scroll;
uniform vec3 u_c0, u_c1, u_c2, u_c3;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }

float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(11.3, 7.9);
    a *= 0.5;
  }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  vec2 p = vec2(uv.x * u_res.x / u_res.y, uv.y);

  float t = u_time * 0.045 + u_scroll * 0.55;

  vec2 q = vec2(fbm(p * 1.25 + vec2(t * 0.55, -t * 0.25)),
                fbm(p * 1.25 + vec2(-t * 0.35, t * 0.4) + 4.7));
  float n1 = fbm(p * 1.6 + 2.2 * q + vec2(t * 0.2, 0.0));
  float n2 = fbm(p * 2.6 - 1.6 * q - vec2(0.0, t * 0.28));

  vec3 col = mix(u_c0, u_c1, smoothstep(0.18, 0.82, n1));
  col = mix(col, u_c2, smoothstep(0.38, 0.94, n2) * 0.88);
  col = mix(col, u_c3, pow(smoothstep(0.52, 1.0, fbm(p * 3.4 + q + t * 0.16)), 2.2) * 0.55);

  /* soft vignette keeps edges quiet so foreground copy stays readable */
  col *= 1.0 - 0.16 * smoothstep(0.25, 0.95, length(uv - vec2(0.5, 0.55)));

  gl_FragColor = vec4(col, 1.0);
}
`;

const hex2rgb = (h) => {
  const n = parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

export default function ShaderGradient({ palette = "dawn", speed = 1, className = "" }) {
  const canvasRef = useRef(null);
  const colors = PALETTES[palette] || PALETTES.dawn;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.display = "";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const gl =
      canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" }) ||
      canvas.getContext("experimental-webgl");
    if (!gl) return; // CSS fallback stays visible underneath

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      // reveal the CSS fallback underneath instead of an opaque black canvas
      canvas.style.display = "none";
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uScroll = gl.getUniformLocation(prog, "u_scroll");
    ["u_c0", "u_c1", "u_c2", "u_c3"].forEach((n, i) =>
      gl.uniform3fv(gl.getUniformLocation(prog, n), hex2rgb(colors[i]))
    );

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();

    let raf = 0;
    let visible = true;
    let smoothScroll = 0;
    const start = performance.now();

    const draw = (now) => {
      const scroll = window.scrollY / Math.max(window.innerHeight, 1);
      smoothScroll += (scroll - smoothScroll) * 0.06;
      gl.uniform1f(uTime, ((now - start) / 1000) * speed);
      gl.uniform1f(uScroll, smoothScroll);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (visible && !reduced) raf = requestAnimationFrame(draw);
    };

    // repaint once after every resize — canvas.width reassignment clears the
    // buffer, and reduced-motion users get no further frames otherwise
    const ro = new ResizeObserver(() => {
      resize();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !reduced) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(draw);
      }
    });
    io.observe(canvas);

    raf = requestAnimationFrame(draw); // always paint at least one frame

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [palette, speed]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute inset-0" style={{ background: FALLBACK[palette] || FALLBACK.dawn }} />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
