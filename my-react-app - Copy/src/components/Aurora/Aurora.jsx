import { Renderer, Program, Mesh, Color, Triangle } from "ogl";
import { useEffect, useRef } from "react";
// Ostavljamo ovaj import, ali ćemo primeniti fiksnu visinu direktno
// import "./Aurora.css";

// Vertex shader
const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

// Fragment shader (isti kao pre)
const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ), 
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec3 colorRamp(float factor) {
  float positions[3];
  positions[0] = 0.0;
  positions[1] = 0.5;
  positions[2] = 1.0;

  factor = clamp(factor, 0.0, 1.0);
  int idx = int(clamp(floor(factor * 2.0), 0.0, 1.0));
  vec3 c0 = uColorStops[idx];
  vec3 c1 = uColorStops[idx + 1];
  float range = positions[idx + 1] - positions[idx];
  float t = range <= 0.0 ? 0.0 : (factor - positions[idx]) / range;
  t = clamp(t, 0.0, 1.0);
  return mix(c0, c1, t);
}

void main() {
  vec2 safeRes = max(uResolution, vec2(1.0));
  // Glavna razlika u odnosu na 1:1 renderovanje je u proporciji UV koordinata.
  // Za sada, koristićemo standardne, ali će uResolution osigurati ispravan odnos.
  vec2 uv = gl_FragCoord.xy / safeRes; 

  vec3 rampColor = colorRamp(uv.x);

  // Aurora formula:
  float height = snoise(vec2(uv.x * 1.9 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  // Podešavanje: Koristimo uv.y * 2.0 da se vertikalno skaliranje prilagodi visini
  height = (uv.y * 2.0 - height + 0.2); 
  float intensity = 1.6 * height;

  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);

  vec3 auroraColor = intensity * rampColor;

  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

export default function Aurora(props) {
  const {
    colorStops = ["#ffa600ff", "#00e1ffff", "#ff2727ff"],
    amplitude = 1.0,
    blend = 0.1,
    // Dodajemo prop za visinu radi lakše kontrole
    height = "500px",
  } = props;

  const propsRef = useRef(props);
  propsRef.current = props;
  const ctnDom = useRef(null);

  // helper: prihvati #RRGGBB, #RRGGBBAA, rgb(), rgba()
  function normalizeColorStr(str) {
    if (typeof str !== "string") return "#000000";
    str = str.trim();
    if (str.startsWith("#") && str.length === 9) {
      // #RRGGBBAA -> skini alpha
      return str.slice(0, 7);
    }
    return str;
  }

  function parseToRGBArray(str) {
    try {
      const normalized = normalizeColorStr(str);
      const c = new Color(normalized);
      return [c.r, c.g, c.b];
    } catch (e) {
      //console.warn("Color parse failed for", str, "-> using black as fallback");
      return [0, 0, 0];
    }
  }

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = "transparent";
    // Canvas mora da zauzme 100% kontejnera koji ima fiksnu visinu
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";

    let program;

    // Funkcija za promenu veličine platna i slanje rezolucije u šejder
    function resize() {
      if (!ctn) return;
      // OGL uzima dimenzije kontejnera
      const width = ctn.offsetWidth || 1;
      const height = ctn.offsetHeight || 1;

      // Postavlja Canvas i GL Viewport
      renderer.setSize(width, height);

      // Ažurira uResolution uniformu koju šejder koristi
      if (program && program.uniforms && program.uniforms.uResolution) {
        program.uniforms.uResolution.value = [width, height];
      }
    }

    // Koristimo ResizeObserver za pouzdanije rešavanje problema visine
    const observer = new ResizeObserver((entries) => {
      // Pozovi resize kad god se veličina kontejnera promeni
      if (entries.length > 0) {
        resize();
      }
    });
    observer.observe(ctn);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) {
      delete geometry.attributes.uv;
    }

    // initial stops as nested arrays (vec3[])
    const initialStops = (propsRef.current.colorStops ?? colorStops).map(
      parseToRGBArray
    );

    // Inicijalna rezolucija
    const initialWidth = ctn.offsetWidth || 1;
    const initialHeight = ctn.offsetHeight || 1;

    program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        // pass as nested arrays of vec3
        uColorStops: { value: initialStops },
        // Inicijalizuj uResolution
        uResolution: { value: [initialWidth, initialHeight] },
        uBlend: { value: blend },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    let animateId = 0;
    const update = (t) => {
      animateId = requestAnimationFrame(update);
      const { time = t * 0.01, speed = 1.0 } = propsRef.current;
      if (!program || !program.uniforms) return;

      program.uniforms.uTime.value = time * speed * 0.1;
      program.uniforms.uAmplitude.value = propsRef.current.amplitude ?? 1.0;
      program.uniforms.uBlend.value = propsRef.current.blend ?? blend;

      // prepare stops each frame as nested arrays [[r,g,b],[r,g,b],[r,g,b]]
      const stops = propsRef.current.colorStops ?? colorStops;
      const nested = stops.map(parseToRGBArray);

      // set uniform — nested arrays are accepted by ogl Program for vec3[]
      program.uniforms.uColorStops.value = nested;

      renderer.render({ scene: mesh });
    };
    animateId = requestAnimationFrame(update);

    // Prvi poziv resize-a (iako ga ResizeObserver radi)
    resize();

    return () => {
      cancelAnimationFrame(animateId);
      // Uklonimo ResizeObserver umesto window.removeEventListener("resize", resize);
      observer.unobserve(ctn);

      if (ctn && gl.canvas.parentNode === ctn) {
        ctn.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amplitude, blend, colorStops, height]); // Dodajemo 'height' kao zavisnost

  // Postavljamo fiksnu visinu direktno na kontejner!
  // 'height' prop se koristi da bi preneo željenu visinu (npr. '600px', '50vh')
  return (
    <div
      ref={ctnDom}
      className="aurora-container"
      style={{
        width: "100%",
        height: 250, // <-- OVDE JE KLJUČ
        zIndex: 1000,
      }}
    />
  );
}
