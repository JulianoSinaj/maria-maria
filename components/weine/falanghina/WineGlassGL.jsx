"use client";
import { useEffect, useRef, useState } from "react";

/* Scroll-getriebenes Weinglas in WebGL — ein einziges Fullscreen-Dreieck,
   kein three.js (siehe components/motion/ShaderGradient.jsx für dasselbe
   Muster). Der Fragment-Shader raymarcht Kelch und Flüssigkeit als SDFs:

   · Flüssigkeitsoberfläche  — überlagerte Gerstner-Wellen + Sloshing-Neigung,
                               die aus der Scroll-Geschwindigkeit gespeist wird
   · Translucency            — Beer-Lambert-Absorption über die durchlaufene
                               Weinstrecke, daher an dünnen Rändern hell-rubin
                               und im Kern granatdunkel
   · Licht                   — Fresnel-Kante am Glas, Specular auf der
                               Weinoberfläche, Kaustik-Fleck unter dem Fuß

   Läuft nur, während die Sektion sichtbar ist; bei reduzierter Bewegung oder
   fehlendem WebGL bleibt das SVG-Fallback darunter stehen. */

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

uniform vec2  u_res;
uniform float u_time;
uniform float u_fill;    /* 0..1 Füllstand, scroll-gebunden */
uniform float u_slosh;   /* signierte Scroll-Geschwindigkeit, gedämpft */
uniform float u_swirl;   /* 0..1 Schwenk-Intensität (Kapitel „Geschmack") */
uniform vec3  u_wine;    /* Grundton des Weins */

const float PI = 3.14159265;

/* ---------- SDF-Bausteine ---------- */

float sdRoundBox(vec3 p, vec3 b, float r){
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}

/* Kelchprofil als Rotationskörper: Radius über der Höhe y */
float bowlRadius(float y){
  /* y: -0.20 (Kelchboden) .. 0.62 (Rand) */
  float t = clamp((y + 0.20) / 0.82, 0.0, 1.0);
  /* bauchig unten, leicht eingezogen am Rand */
  float r = 0.42 * sqrt(max(t, 0.0001)) * (1.0 - 0.20 * t * t);
  return max(r, 0.005);
}

/* Signierte Distanz zur Kelchwand (dünne Schale) */
float sdBowl(vec3 p){
  float d = length(p.xz) - bowlRadius(p.y);
  /* oben offen, unten geschlossen */
  float cap = max(p.y - 0.62, -0.20 - p.y);
  return max(abs(d) - 0.008, cap);
}

/* Stiel und Fuß */
float sdStem(vec3 p){
  float stem = length(p.xz) - 0.022;
  stem = max(stem, max(p.y + 0.20, -0.72 - p.y));
  vec3 f = p - vec3(0.0, -0.72, 0.0);
  float foot = max(length(f.xz) - 0.30, abs(f.y) - 0.012);
  return min(stem, foot);
}

float sdGlass(vec3 p){ return min(sdBowl(p), sdStem(p)); }

/* ---------- Flüssigkeitsoberfläche ---------- */

/* Gerstner-artige Überlagerung: zwei Ringwellen + zwei gerichtete Wellen.
   Die Amplitude skaliert mit Slosh und Swirl, sodass die Oberfläche in Ruhe
   fast spiegelglatt bleibt und beim Scrollen lebendig wird. */
float waveHeight(vec2 xz){
  float amp = 0.0035 + 0.022 * abs(u_slosh) + 0.016 * u_swirl;
  float r = length(xz);
  float a = atan(xz.y, xz.x);

  float w = 0.0;
  w += sin(r * 26.0 - u_time * 2.4) * 0.45;
  w += sin(r * 41.0 - u_time * 3.1 + 1.7) * 0.26;
  w += sin(dot(xz, vec2(19.0, 13.0)) + u_time * 1.9) * 0.30;
  w += sin(dot(xz, vec2(-11.0, 23.0)) - u_time * 1.5) * 0.22;
  /* Schwenken: eine um die Achse laufende Welle, am Rand am höchsten */
  w += sin(a * 2.0 - u_time * 3.4) * u_swirl * 1.6 * smoothstep(0.05, 0.42, r);

  return w * amp;
}

/* Höhe der Weinoberfläche an (x,z): Füllstand + Neigung + Wellen.
   Der Kelch reicht von -0.20 (Boden) bis 0.62 (Rand); bei vollem u_fill
   steht der Spiegel auf 0.21 — also knapp halbhoch, so wie Rotwein
   tatsächlich eingeschenkt wird. */
float surfaceY(vec2 xz){
  float base = mix(-0.19, 0.21, clamp(u_fill, 0.0, 1.0));
  /* Trägheits-Neigung entgegen der Scrollrichtung */
  float tilt = clamp(u_slosh, -1.0, 1.0) * 0.075;
  float lean = xz.x * tilt + xz.y * tilt * 0.35;
  return base + lean + waveHeight(xz);
}

/* Weinvolumen: innerhalb des Kelchs und unterhalb der Oberfläche */
float sdWine(vec3 p){
  float inside = length(p.xz) - (bowlRadius(p.y) - 0.009);
  float below  = p.y - surfaceY(p.xz);
  return max(max(inside, below), -0.20 - p.y);
}

/* Normale der Weinoberfläche über finite Differenzen der Höhenfunktion */
vec3 surfaceNormal(vec2 xz){
  float e = 0.006;
  float hx = surfaceY(xz + vec2(e, 0.0)) - surfaceY(xz - vec2(e, 0.0));
  float hz = surfaceY(xz + vec2(0.0, e)) - surfaceY(xz - vec2(0.0, e));
  return normalize(vec3(-hx, 2.0 * e, -hz));
}

vec3 glassNormal(vec3 p){
  vec2 e = vec2(0.0012, 0.0);
  return normalize(vec3(
    sdGlass(p + e.xyy) - sdGlass(p - e.xyy),
    sdGlass(p + e.yxy) - sdGlass(p - e.yxy),
    sdGlass(p + e.yyx) - sdGlass(p - e.yyx)
  ));
}

/* ---------- Raymarching ---------- */

struct Hit { float t; int id; };

Hit march(vec3 ro, vec3 rd, float tmax){
  float t = 0.0;
  Hit h; h.t = tmax; h.id = 0;
  for (int i = 0; i < 90; i++){
    vec3 p = ro + rd * t;
    float dg = sdGlass(p);
    float dw = sdWine(p);
    float d = min(dg, dw);
    if (d < 0.0009){
      h.t = t;
      h.id = (dw < dg) ? 2 : 1;
      return h;
    }
    t += d * 0.85;
    if (t > tmax) break;
  }
  return h;
}

/* Strecke, die ein Strahl durch den Wein zurücklegt — Grundlage der
   Beer-Lambert-Absorption und damit der glaubwürdigen Transluzenz. */
float wineDepth(vec3 ro, vec3 rd){
  float t = 0.0, acc = 0.0;
  for (int i = 0; i < 40; i++){
    vec3 p = ro + rd * t;
    float d = sdWine(p);
    if (d < 0.0) { acc += 0.012; t += 0.012; }
    else { t += max(d, 0.006); }
    if (t > 1.6) break;
  }
  return acc;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res.xy) / u_res.y;

  /* Kamera: leicht von oben, damit die Oberfläche als Ellipse liest */
  vec3 ro = vec3(0.0, 0.34, 3.05);
  vec3 ta = vec3(0.0, -0.06, 0.0);
  vec3 fw = normalize(ta - ro);
  vec3 rt = normalize(cross(vec3(0.0, 1.0, 0.0), fw));
  vec3 up = cross(fw, rt);
  vec3 rd = normalize(uv.x * rt + uv.y * up + 1.55 * fw);

  vec3 keyDir  = normalize(vec3(-0.55, 0.85, 0.45));
  vec3 rimDir  = normalize(vec3(0.70, 0.30, -0.55));

  vec3 col = vec3(0.0);
  float alpha = 0.0;

  Hit h = march(ro, rd, 6.0);

  if (h.id != 0){
    vec3 p = ro + rd * h.t;

    if (h.id == 2){
      /* --- Weinoberfläche --- */
      vec3 n = surfaceNormal(p.xz);
      float depth = wineDepth(p + rd * 0.004, rd);

      /* Beer-Lambert: Rotwein absorbiert Grün/Blau weit stärker als Rot.
         Das durchscheinende Licht ist warm, nicht weiß — sonst wäscht der
         Grünkanal die Farbe zu Mauve aus. */
      vec3 sigma = vec3(5.5, 26.0, 30.0);
      vec3 trans = exp(-sigma * depth);
      vec3 lit   = vec3(0.85, 0.30, 0.26);
      vec3 body  = u_wine * 0.55 + lit * trans * 0.8;

      /* Streuung: nur an sehr dünnen Rändern, sonst granatdunkel */
      float thin = 1.0 - smoothstep(0.0, 0.04, depth);
      body += vec3(0.55, 0.10, 0.13) * thin * 0.45;

      float fres = pow(1.0 - max(dot(n, -rd), 0.0), 4.0);
      float spec = pow(max(dot(reflect(-keyDir, n), -rd), 0.0), 120.0);

      col = body;
      col += vec3(1.0, 0.93, 0.88) * spec * 1.1;            /* Glanzlicht */
      col += vec3(0.95, 0.35, 0.38) * fres * 0.28;          /* Kante */
      alpha = 1.0;

    } else {
      /* --- Glaskörper --- */
      vec3 n = glassNormal(p);
      float fres = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);

      /* Wein hinter dem Glas durchscheinen lassen — dieselbe Absorption
         wie an der Oberfläche, damit die Wand farblich anschließt. */
      float depth = wineDepth(p + rd * 0.012, rd);
      vec3 sigma = vec3(5.5, 26.0, 30.0);
      vec3 lit = vec3(0.85, 0.30, 0.26);
      float hasWine = step(0.004, depth);
      vec3 behind = u_wine * 0.55 + lit * exp(-sigma * depth) * 0.8;

      float spec = pow(max(dot(reflect(-keyDir, n), -rd), 0.0), 140.0);
      float rim  = pow(max(dot(reflect(-rimDir, n), -rd), 0.0), 30.0);

      /* Vor dem Wein deckt die Wand voll, daneben trägt sie nur Kanten */
      col = behind * hasWine;
      col += vec3(1.0) * spec * 0.9;
      col += vec3(1.0, 0.97, 0.94) * rim * 0.30;
      col += vec3(0.12, 0.10, 0.10) * fres * 0.5 * (1.0 - hasWine);

      alpha = clamp(max(hasWine, fres * 0.8 + spec + rim * 0.6), 0.0, 1.0);
    }
  }

  /* Kaustik: warmer Lichtfleck, den der Wein auf die Standfläche wirft */
  vec2 cp = (uv - vec2(0.0, -0.40)) * vec2(1.0, 2.6);
  float caustic = exp(-dot(cp, cp) * 16.0) * clamp(u_fill, 0.0, 1.0);
  col   += vec3(0.55, 0.10, 0.16) * caustic * 0.55;
  alpha  = max(alpha, caustic * 0.45);

  /* leichtes Filmkorn bricht die Farbbänder in den dunklen Verläufen */
  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * 0.012;

  gl_FragColor = vec4(col, alpha);
}
`;

const hex2rgb = (h) => {
  const n = parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

/* fill/swirl kommen als MotionValues herein, damit der Scroll-Sync ohne
   React-Renders auskommt: gelesen wird ausschließlich im RAF. */
export default function WineGlassGL({ fill, swirl, wine = "#6E0F1D", className = "", onFail }) {
  const canvasRef = useRef(null);
  const [retry, setRetry] = useState(0);
  const stateRef = useRef({ fill, swirl });
  stateRef.current = { fill, swirl };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onFail?.();
      return;
    }

    const gl =
      canvas.getContext("webgl", {
        antialias: true,
        alpha: true,
        premultipliedAlpha: false,
        powerPreference: "low-power",
      }) || canvas.getContext("experimental-webgl");
    if (!gl) {
      onFail?.();
      return;
    }

    const compile = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      /* Ein verlorener Kontext meldet sich mit lauter null-Logs — das ist
         kein GLSL-Fehler, sondern Ressourcendruck (viele Kontexte auf einer
         Seite, Software-Rasterizer). Dann lieber einmal neu aufsetzen als
         dauerhaft auf das SVG zurückfallen. */
      const lost = gl.isContextLost();
      if (process.env.NODE_ENV !== "production" && !lost) {
        console.error("[WineGlassGL] link failed:", gl.getProgramInfoLog(prog));
      }
      if (lost && retry < 2) {
        const t = setTimeout(() => setRetry((r) => r + 1), 400);
        return () => clearTimeout(t);
      }
      onFail?.();
      return;
    }
    gl.useProgram(prog);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uFill = gl.getUniformLocation(prog, "u_fill");
    const uSlosh = gl.getUniformLocation(prog, "u_slosh");
    const uSwirl = gl.getUniformLocation(prog, "u_swirl");
    gl.uniform3fv(gl.getUniformLocation(prog, "u_wine"), hex2rgb(wine));

    /* Raymarching ist fill-rate-gebunden — DPR deckeln kostet visuell fast
       nichts und hält auch Retina-Panels bei 60 fps. */
    const dpr = Math.min(window.devicePixelRatio || 1, 1.4);
    /* Der Backing-Store wird bei jedem Frame gegen die CSS-Box geprüft: die
       Bühne ist an svh-Einheiten gebunden und steht beim ersten Effektlauf
       noch nicht, ein einmaliges resize() würde 300×150 zementieren. */
    /* uploadedW/H gehören zu diesem Programm, nicht zum Canvas: der
       Backing-Store kann aus einem früheren Effektlauf schon die richtige
       Größe haben (StrictMode), das frische Programm hätte u_res dann nie
       gesetzt und jeder Strahl liefe gegen eine 0×0-Auflösung ins NaN. */
    let uploadedW = 0;
    let uploadedH = 0;
    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return false;
      const cw = Math.round(w * dpr);
      const ch = Math.round(h * dpr);
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }
      if (uploadedW !== cw || uploadedH !== ch) {
        uploadedW = cw;
        uploadedH = ch;
        gl.viewport(0, 0, cw, ch);
        gl.uniform2f(uRes, cw, ch);
      }
      return true;
    };
    resize();

    let raf = 0;
    let visible = true;
    let smoothFill = stateRef.current.fill?.get?.() ?? 0;
    let smoothSwirl = 0;
    let slosh = 0;
    let prevFill = smoothFill;
    let prevNow = performance.now();
    const start = prevNow;

    const draw = (now) => {
      const dt = Math.min((now - prevNow) / 1000, 0.05);
      prevNow = now;
      resize();

      const targetFill = stateRef.current.fill?.get?.() ?? 0;
      const targetSwirl = stateRef.current.swirl?.get?.() ?? 0;

      /* Kritisch gedämpfte Annäherung, bewusst träge (k≈3.5): jeder einzelne
         Scroll-Tick hebt den Spiegel sichtbar an und läuft danach noch kurz
         nach, statt sofort einzurasten. Framerate-unabhängig. */
      const k = 1 - Math.exp(-dt * 3.5);
      smoothFill += (targetFill - smoothFill) * k;
      smoothSwirl += (targetSwirl - smoothSwirl) * (1 - Math.exp(-dt * 4.0));

      /* Sloshing: Impuls aus der Füllgeschwindigkeit, danach ausschwingen */
      const vel = dt > 0 ? (smoothFill - prevFill) / dt : 0;
      prevFill = smoothFill;
      slosh += (vel * 2.6 - slosh) * (1 - Math.exp(-dt * 6.0));
      slosh *= 1 - Math.min(dt * 1.2, 0.5);

      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform1f(uFill, smoothFill);
      gl.uniform1f(uSlosh, Math.max(-1, Math.min(1, slosh)));
      gl.uniform1f(uSwirl, smoothSwirl);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (visible) raf = requestAnimationFrame(draw);
    };

    const ro = new ResizeObserver(() => {
      resize();
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(draw);
    });
    ro.observe(canvas);

    /* Außerhalb des Viewports wird nicht gerendert — der teure Raymarch
       läuft nur, solange die Sektion tatsächlich sichtbar ist. */
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible) {
          prevNow = performance.now();
          raf = requestAnimationFrame(draw);
        }
      },
      { rootMargin: "10% 0px" }
    );
    io.observe(canvas);

    /* Verliert der Browser den Kontext später (Tab-Wechsel, GPU-Reset),
       einmal neu aufsetzen statt schwarz stehen zu bleiben. */
    const onLost = (e) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      if (retry < 2) setRetry((r) => r + 1);
      else onFail?.();
    };
    canvas.addEventListener("webglcontextlost", onLost);

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (visible) {
        prevNow = performance.now();
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      /* Kein loseContext() hier: React ruft den Effekt im StrictMode zweimal
         auf, und ein absichtlich verlorener Kontext lässt sich auf demselben
         Canvas nicht wiederherstellen — der zweite Lauf bekäme eine Leiche.
         Programm und Puffer werden einzeln freigegeben, der Kontext selbst
         wird mit dem Canvas eingesammelt. */
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [wine, retry]); // eslint-disable-line react-hooks/exhaustive-deps

  return <canvas ref={canvasRef} className={`h-full w-full ${className}`} aria-hidden="true" />;
}
