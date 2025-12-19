import {
  AbstractShapeBg,
  AestheticFluidBg,
  AmbientLightBg,
  BigBlobBg,
  BlurDotBg,
  BlurGradientBg,
  ChaosWavesBg,
  CurveGradientBg,
  GridArrayBg,
  RandomCubesBg,
  StepGradientBg,
  SwirlingCurvesBg,
  TrianglesMosaicBg,
  WavyWavesBg,
} from "https://esm.sh/color4bg";

const $ = (sel) => document.querySelector(sel);

const GEN = {
  "abstract-shape": { cls: AbstractShapeBg, label: "Abstract Shape" },
  "aesthetic-fluid": { cls: AestheticFluidBg, label: "Aesthetic Fluid" },
  "ambient-light": { cls: AmbientLightBg, label: "Ambient Light" },
  "big-blob": { cls: BigBlobBg, label: "Big Blob" },
  "blur-dot": { cls: BlurDotBg, label: "Blur Dot" },
  "blur-gradient": { cls: BlurGradientBg, label: "Blur Gradient" },
  "chaos-waves": { cls: ChaosWavesBg, label: "Chaos Waves" },
  "curve-gradient": { cls: CurveGradientBg, label: "Curve Gradient" },
  "grid-array": { cls: GridArrayBg, label: "Grid Array" },
  "random-cubes": { cls: RandomCubesBg, label: "Random Cubes" },
  "step-gradient": { cls: StepGradientBg, label: "Step Gradient" },
  "swirling-curves": { cls: SwirlingCurvesBg, label: "Swirling Curves" },
  "triangles-mosaic": { cls: TrianglesMosaicBg, label: "Triangles Mosaic" },
  "wavy-waves": { cls: WavyWavesBg, label: "Wavy Waves" },
};

const GEN_SETTINGS = {
  "aesthetic-fluid": [
    { key: "blur", label: "Blur", min: 0, max: 1, step: 0.01, value: 0.35 },
    { key: "speed", label: "Flow Speed", min: 0, max: 3, step: 0.01, value: 1.0 },
  ],
  "chaos-waves": [
    { key: "speed", label: "Speed", min: 0, max: 3, step: 0.01, value: 1.0 },
    { key: "amplitude", label: "Amplitude", min: 0, max: 2, step: 0.01, value: 1.0 },
    { key: "frequency", label: "Frequency", min: 0.1, max: 6, step: 0.01, value: 2.0 },
  ],
  "curve-gradient": [
    { key: "curveCount", label: "Curve Count", min: 1, max: 12, step: 1, value: 6 },
    { key: "thickness", label: "Thickness", min: 0.1, max: 3, step: 0.01, value: 1.0 },
  ],
  "swirling-curves": [
    { key: "swirl", label: "Swirl Amount", min: 0, max: 2, step: 0.01, value: 1.0 },
    { key: "speed", label: "Speed", min: 0, max: 3, step: 0.01, value: 1.0 },
    { key: "thickness", label: "Thickness", min: 0.1, max: 3, step: 0.01, value: 1.0 },
  ],
  "blur-gradient": [
    { key: "blur", label: "Blur", min: 0, max: 1, step: 0.01, value: 0.5 },
    { key: "scale", label: "Scale", min: 0.25, max: 3, step: 0.01, value: 1.0 },
  ],
  "ambient-light": [
    { key: "intensity", label: "Intensity", min: 0, max: 2, step: 0.01, value: 1.0 },
    { key: "speed", label: "Drift Speed", min: 0, max: 3, step: 0.01, value: 1.0 },
  ],
  "triangles-mosaic": [
    { key: "size", label: "Cell Size", min: 10, max: 200, step: 1, value: 70 },
    { key: "jitter", label: "Jitter", min: 0, max: 1, step: 0.01, value: 0.35 },
  ],
  "organic-shapes": [
    { key: "count", label: "Shape Count", min: 1, max: 40, step: 1, value: 16 },
    { key: "softness", label: "Softness", min: 0, max: 1, step: 0.01, value: 0.6 },
  ],
  "random-cubes": [
    { key: "count", label: "Cube Count", min: 1, max: 60, step: 1, value: 24 },
    { key: "size", label: "Cube Size", min: 0.1, max: 2, step: 0.01, value: 1.0 },
  ],
  "wavy-waves": [
    { key: "speed", label: "Speed", min: 0, max: 3, step: 0.01, value: 1.0 },
    { key: "waveCount", label: "Wave Count", min: 1, max: 12, step: 1, value: 6 },
    { key: "amplitude", label: "Amplitude", min: 0, max: 2, step: 0.01, value: 1.0 },
  ],
  "big-blob": [
    { key: "blobiness", label: "Blobiness", min: 0, max: 2, step: 0.01, value: 1.0 },
    { key: "speed", label: "Speed", min: 0, max: 3, step: 0.01, value: 1.0 },
  ],
  "blur-dot": [
    { key: "dotSize", label: "Dot Size", min: 2, max: 80, step: 1, value: 20 },
    { key: "blur", label: "Blur", min: 0, max: 1, step: 0.01, value: 0.5 },
    { key: "count", label: "Dot Count", min: 1, max: 80, step: 1, value: 24 },
  ],
  "grid-array": [
    { key: "cellSize", label: "Cell Size", min: 10, max: 200, step: 1, value: 60 },
    { key: "lineWidth", label: "Line Width", min: 0.5, max: 6, step: 0.1, value: 2.0 },
    { key: "glow", label: "Glow", min: 0, max: 1, step: 0.01, value: 0.35 },
  ],
  "abstract-shape": [
    { key: "shapeCount", label: "Shape Count", min: 1, max: 40, step: 1, value: 16 },
    { key: "softness", label: "Softness", min: 0, max: 1, step: 0.01, value: 0.6 },
  ],
  "step-gradient": [
    { key: "steps", label: "Steps", min: 2, max: 24, step: 1, value: 8 },
    { key: "smooth", label: "Smooth", min: 0, max: 1, step: 0.01, value: 0.25 },
  ],
};

const DEFAULTS = {
  generator: "aesthetic-fluid",
  seed: 1000,
  loop: true,
  colors: ["#D1ADFF", "#98D69B", "#FAE390", "#FFACD8", "#7DD5FF", "#D1ADFF"],
  genOpts: {}, // filled per generator
};

let state = structuredClone(DEFAULTS);
let instance = null;

function populateGeneratorSelect() {
  const sel = $("#generator");
  sel.innerHTML = Object.entries(GEN)
    .map(([key, meta]) => `<option value="${key}">${meta.label}</option>`)
    .join("");
  sel.value = state.generator;
}

function buildPaletteUI() {
  const wrap = $("#palette");
  wrap.innerHTML = "";
  for (let i = 0; i < 6; i++) {
    const c = state.colors[i] ?? "#000000";
    const el = document.createElement("div");
    el.className = "swatch";
    el.innerHTML = `<input type="color" value="${c}" data-idx="${i}">`;
    wrap.appendChild(el);
  }

  wrap.addEventListener("input", (e) => {
    const t = e.target;
    if (t?.type !== "color") return;
    const idx = Number(t.dataset.idx);
    state.colors[idx] = t.value;
    scheduleApply();
  }, { passive: true });
}

function buildGenSettingsUI() {
  const key = state.generator;
  const schema = GEN_SETTINGS[key] ?? [];
  const wrap = $("#genSettings");
  wrap.innerHTML = "";
  
  state.genOpts[key] ??= {};
  for (const s of schema) {
    if (state.genOpts[key][s.key] === undefined) state.genOpts[key][s.key] = s.value;
  }

  if (!schema.length) {
    wrap.innerHTML = `<div class="hint">No extra controls defined for this generator (yet).</div>`;
    return;
  }

  for (const s of schema) {
    const val = state.genOpts[key][s.key];

    const row = document.createElement("div");
    row.className = "slider";
    row.innerHTML = `
      <div class="slider__top">
        <div class="slider__label">${s.label}</div>
        <div class="slider__value" data-val="${s.key}">${val}</div>
      </div>
      <input
        type="range"
        min="${s.min}"
        max="${s.max}"
        step="${s.step}"
        value="${val}"
        data-key="${s.key}"
      />
    `;
    wrap.appendChild(row);
  }

  wrap.addEventListener("input", (e) => {
    const t = e.target;
    if (t?.type !== "range") return;
    const k = t.dataset.key;
    const v = Number(t.value);

    state.genOpts[state.generator][k] = v;
    const out = wrap.querySelector(`[data-val="${CSS.escape(k)}"]`);
    if (out) out.textContent = String(v);

    scheduleApply();
  }, { passive: true });
}

function readCommonUI() {
  state.generator = $("#generator").value;
  state.seed = Number($("#seed").value || 0);
  state.loop = $("#loop").checked;
}

function writeCommonUI() {
  $("#generator").value = state.generator;
  $("#seed").value = String(state.seed);
  $("#loop").checked = !!state.loop;
}

function destroyInstance() {
  const host = $("#bg");
  host.innerHTML = "";
  instance = null;
}

function applyNow() {
  readCommonUI();

  destroyInstance();

  const gen = GEN[state.generator];
  if (!gen) return;

  const extra = state.genOpts[state.generator] ?? {};
  const opts = {
    dom: "bg",
    colors: state.colors.filter(Boolean),
    seed: state.seed,
    loop: state.loop,
    ...extra,
  };

  try {
    instance = new gen.cls(opts);
  } catch (err) {
    console.error("Failed to create generator:", state.generator, err, opts);
  }

  buildGenSettingsUI();
}

let applyTimer = null;
function scheduleApply() {
  clearTimeout(applyTimer);
  applyTimer = setTimeout(() => applyNow(), 120);
}

function randomHex() {
  const n = Math.floor(Math.random() * 0xffffff);
  return `#${n.toString(16).padStart(6, "0")}`;
}

function hookUI() {
  $("#generator").addEventListener("change", () => {
    // ensure per-gen state bucket exists
    state.genOpts[state.generator] ??= {};
    buildGenSettingsUI();
    scheduleApply();
  });

  $("#seed").addEventListener("change", scheduleApply);
  $("#loop").addEventListener("change", scheduleApply);

  $("#randomSeed").addEventListener("click", () => {
    state.seed = Math.floor(Math.random() * 1_000_000);
    writeCommonUI();
    scheduleApply();
  });

  $("#randomColors").addEventListener("click", () => {
    state.colors = Array.from({ length: 6 }, randomHex);
    buildPaletteUI();
    scheduleApply();
  });

  $("#apply").addEventListener("click", () => applyNow());

  $("#reset").addEventListener("click", () => {
    state = structuredClone(DEFAULTS);
    writeCommonUI();
    buildPaletteUI();
    buildGenSettingsUI();
    applyNow();
  });
}

// Boot
populateGeneratorSelect();
writeCommonUI();
buildPaletteUI();
buildGenSettingsUI();
hookUI();
applyNow();
