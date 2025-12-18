import "./style.css";

// Import directly from the downloaded library sources:
import {
  AestheticFluidBg,
  BlurGradientBg,
  ChaosWavesBg,
  CurveGradientBg,
  SwirlingCurvesBg,
  AmbientLightBg,
  TrianglesMosaicBg,
  AbstractShapeBg,
  RandomCubesBg,
  WavyWavesBg,
  BigBlobBg,
  BlurDotBg,
  GridArrayBg,
  StepGradientBg,
} from "../lib/color4bg-src/src/index.js"; // adjust if their index path differs

const GENERATORS = [
  ["aesthetic-fluid", "Aesthetic Fluid", AestheticFluidBg],
  ["chaos-waves", "Chaos Waves", ChaosWavesBg],
  ["curve-gradient", "Curve Gradient", CurveGradientBg],
  ["swirling-curves", "Swirling Curves", SwirlingCurvesBg],
  ["blur-gradient", "Blur Gradient", BlurGradientBg],
  ["ambient-light", "Ambient Light", AmbientLightBg],
  ["triangles-mosaic", "Triangles Mosaic", TrianglesMosaicBg],
  ["abstract-shape", "Organic Shapes", AbstractShapeBg],
  ["random-cubes", "Random Cubes", RandomCubesBg],
  ["wavy-waves", "Wavy Waves", WavyWavesBg],
  ["big-blob", "Big Blob", BigBlobBg],
  ["blur-dot", "Blur Dot", BlurDotBg],
  ["grid-array", "Grid Array", GridArrayBg],
  ["step-gradient", "Step Gradient", StepGradientBg],
];

const PRESETS = {
  vivid: ["#D1ADFF","#98D69B","#FAE390","#FFACD8","#7DD5FF","#D1ADFF"],
  pastel: ["#ffd6e7","#c7f0ff","#d8ffd2","#fff2b8","#e2d4ff","#ffd6e7"],
  bw: ["#ffffff","#d9d9d9","#b3b3b3","#808080","#404040","#0a0a0a"],
};

let current = null;

function el(tag, cls) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  return n;
}

function destroyCurrent() {
  try { current?.destroy?.(); } catch {}
  try { current?.dispose?.(); } catch {}
  current = null;
  document.querySelector("#bg").innerHTML = "";
}

function apply(opts) {
  destroyCurrent();
  const Bg = opts.BgClass;
  current = new Bg({
    dom: "bg",
    colors: opts.colors,
    seed: opts.seed,
    loop: opts.loop,
  });
}

function ui() {
  document.body.innerHTML = `
    <div id="bg"></div>
    <aside class="panel">
      <div class="row">
        <select id="gen"></select>
        <input id="seed" type="number" value="1000" />
        <label class="chk"><input id="loop" type="checkbox" checked /> loop</label>
        <button id="apply">Apply</button>
      </div>
      <div class="row">
        <button data-preset="vivid">Vivid</button>
        <button data-preset="pastel">Pastel</button>
        <button data-preset="bw">B/W</button>
        <button id="png">PNG</button>
      </div>
      <div id="colors" class="colors"></div>
      <div class="hint" id="status"></div>
    </aside>
  `;

  const genSel = document.querySelector("#gen");
  GENERATORS.forEach(([k, label]) => {
    const o = document.createElement("option");
    o.value = k; o.textContent = label;
    genSel.appendChild(o);
  });
  genSel.value = "aesthetic-fluid";

  const colorsWrap = document.querySelector("#colors");

  function setColors(arr) {
    colorsWrap.innerHTML = "";
    arr.slice(0,6).forEach((hex) => {
      const w = el("div", "c");
      const p = el("input");
      p.type = "color";
      p.value = hex;
      w.appendChild(p);
      colorsWrap.appendChild(w);
    });
  }

  function getColors() {
    return [...colorsWrap.querySelectorAll('input[type="color"]')].map(i => i.value);
  }

  setColors(PRESETS.vivid);

  function doApply() {
    const key = genSel.value;
    const BgClass = GENERATORS.find(g => g[0] === key)?.[2] ?? AestheticFluidBg;
    const seed = Number(document.querySelector("#seed").value || 0);
    const loop = document.querySelector("#loop").checked;
    apply({ BgClass, colors: getColors(), seed, loop });
    document.querySelector("#status").textContent = `Applied: ${key} • seed=${seed} • loop=${loop}`;
  }

  document.querySelector("#apply").addEventListener("click", doApply);
  genSel.addEventListener("change", doApply);
  document.querySelector("#seed").addEventListener("change", doApply);
  document.querySelector("#loop").addEventListener("change", doApply);

  document.querySelectorAll("[data-preset]").forEach(btn => {
    btn.addEventListener("click", () => {
      setColors(PRESETS[btn.dataset.preset]);
      doApply();
    });
  });

  document.querySelector("#png").addEventListener("click", () => {
    const canvas = document.querySelector("#bg canvas");
    if (!canvas) return;
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `color4bg_${genSel.value}_seed${document.querySelector("#seed").value}.png`;
    a.click();
  });

  doApply();
}

ui();
