// IMPORTANT: This uses esm.sh so you can run it without a bundler.
// If esm.sh ever changes behavior, use Option B (npm + Vite) below.

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
} from "https://esm.sh/color4bg@0.1.1?bundle"; // repo docs show "npm install color4bg" :contentReference[oaicite:2]{index=2}

const $ = (sel) => document.querySelector(sel);

const GENERATORS = [
  ["aesthetic-fluid", "Aesthetic Fluid", AestheticFluidBg],
  ["chaos-waves", "Chaos Waves", ChaosWavesBg],
  ["curve-gradient", "Curve Gradient", CurveGradientBg],
  ["swirling-curves", "Swirling Curves", SwirlingCurvesBg],
  ["blur-gradient", "Blur Gradient", BlurGradientBg],
  ["ambient-light", "Ambient Light", AmbientLightBg],
  ["triangles-mosaic", "Triangles Mosaic", TrianglesMosaicBg],
  ["abstract-shape", "Organic Shapes (Abstract Shape)", AbstractShapeBg],
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
let isRecording = false;
let recorder = null;
let recordedChunks = [];

function setStatus(msg) {
  $("#status").textContent = msg || "";
}

function clampHex(hex) {
  const h = (hex || "").trim();
  if (/^#[0-9a-fA-F]{6}$/.test(h)) return h.toUpperCase();
  return "#FFFFFF";
}

function randHex() {
  const n = Math.floor(Math.random() * 0xffffff);
  return "#" + n.toString(16).padStart(6, "0").toUpperCase();
}

function buildGeneratorSelect() {
  const sel = $("#generator");
  for (const [key, label] of GENERATORS) {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = label;
    sel.appendChild(opt);
  }
}

function buildColorInputs(initial) {
  const wrap = $("#colors");
  wrap.innerHTML = "";

  for (let i = 0; i < 6; i++) {
    const c = document.createElement("div");
    c.className = "color";

    const picker = document.createElement("input");
    picker.type = "color";
    picker.value = clampHex(initial[i] ?? PRESETS.vivid[i]);

    const hex = document.createElement("input");
    hex.className = "hex";
    hex.value = picker.value;
    hex.spellcheck = false;

    picker.addEventListener("input", () => { hex.value = picker.value.toUpperCase(); });
    hex.addEventListener("input", () => {
      const v = clampHex(hex.value);
      if (v !== hex.value.toUpperCase()) return;
      picker.value = v;
    });
    hex.addEventListener("blur", () => {
      const v = clampHex(hex.value);
      hex.value = v;
      picker.value = v;
    });

    c.appendChild(picker);
    c.appendChild(hex);
    wrap.appendChild(c);
  }
}

function readColors() {
  const nodes = [...$("#colors").querySelectorAll(".color")];
  const colors = nodes.map((n) => clampHex(n.querySelector("input[type=color]").value));
  // library supports up to 6 colors :contentReference[oaicite:3]{index=3}
  return colors.slice(0, 6);
}

function readGeneratorClass() {
  const key = $("#generator").value;
  const found = GENERATORS.find((g) => g[0] === key);
  return found?.[2] ?? AestheticFluidBg;
}

function destroyCurrent() {
  try { current?.destroy?.(); } catch {}
  try { current?.dispose?.(); } catch {}
  current = null;

  // Clear DOM container in case the lib appended a canvas
  const bg = $("#bg");
  bg.innerHTML = "";
}

function apply() {
  const BgClass = readGeneratorClass();
  const colors = readColors();
  const seed = Number($("#seed").value || 0);
  const loop = $("#loop").checked;

  destroyCurrent();

  // Library config per README: { dom, colors, seed, loop } :contentReference[oaicite:4]{index=4}
  current = new BgClass({
    dom: "bg",
    colors,
    seed,
    loop,
  });

  setStatus(`Applied • seed=${seed} • loop=${loop ? "on" : "off"}`);
}

function copyJS() {
  const BgClass = readGeneratorClass();
  const colors = readColors();
  const seed = Number($("#seed").value || 0);
  const loop = $("#loop").checked;

  const className = BgClass?.name || "AestheticFluidBg";

  const snippet =
`import { ${className} } from "color4bg";

new ${className}({
  dom: "bg",
  colors: ${JSON.stringify(colors)},
  seed: ${seed},
  loop: ${loop}
});`;

  navigator.clipboard.writeText(snippet)
    .then(() => setStatus("Copied JS snippet to clipboard."))
    .catch(() => setStatus("Clipboard blocked (try HTTPS or localhost)."));
}

function exportPNG() {
  const canvas = $("#bg").querySelector("canvas");
  if (!canvas) return setStatus("No canvas found to export.");
  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = `color4bg_${$("#generator").value}_seed${$("#seed").value}.png`;
  a.click();
  setStatus("Exported PNG.");
}

async function toggleWebmRecording() {
  const canvas = $("#bg").querySelector("canvas");
  if (!canvas) return setStatus("No canvas found to record.");

  if (!isRecording) {
    recordedChunks = [];
    const stream = canvas.captureStream(60);
    recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9" });

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) recordedChunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `color4bg_${$("#generator").value}_seed${$("#seed").value}.webm`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus("Saved WebM.");
    };

    recorder.start(250);
    isRecording = true;
    $("#btnWebm").textContent = "Stop WebM";
    setStatus("Recording… click again to stop.");
  } else {
    recorder?.stop();
    isRecording = false;
    $("#btnWebm").textContent = "Record WebM";
  }
}

function setColorsPreset(name) {
  const preset = PRESETS[name];
  if (!preset) return;
  buildColorInputs(preset);
}

function randomizeColors() {
  const cols = Array.from({ length: 6 }, randHex);
  buildColorInputs(cols);
}

function randomizeSeed() {
  $("#seed").value = String(Math.floor(Math.random() * 1_000_000_000));
}

function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
}

function toggleUI() {
  const panel = document.querySelector(".panel");
  panel.classList.toggle("panel--hidden");
}

function wireUI() {
  $("#btnRegen").addEventListener("click", apply);
  $("#generator").addEventListener("change", apply);
  $("#seed").addEventListener("change", apply);
  $("#loop").addEventListener("change", apply);

  $("#btnRandomSeed").addEventListener("click", () => { randomizeSeed(); apply(); });
  $("#btnRandomColors").addEventListener("click", () => { randomizeColors(); apply(); });

  $("#btnVivid").addEventListener("click", () => { setColorsPreset("vivid"); apply(); });
  $("#btnPastel").addEventListener("click", () => { setColorsPreset("pastel"); apply(); });
  $("#btnBW").addEventListener("click", () => { setColorsPreset("bw"); apply(); });

  $("#btnPng").addEventListener("click", exportPNG);
  $("#btnWebm").addEventListener("click", toggleWebmRecording);
  $("#btnCopyJS").addEventListener("click", copyJS);

  $("#btnFullscreen").addEventListener("click", toggleFullscreen);
  $("#btnToggleUI").addEventListener("click", toggleUI);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") apply();
    if (e.key.toLowerCase() === "f") toggleFullscreen();
    if (e.key.toLowerCase() === "h") toggleUI();
  });
}

function boot() {
  buildGeneratorSelect();
  $("#generator").value = "aesthetic-fluid";
  buildColorInputs(PRESETS.vivid);
  wireUI();
  apply();
}

boot();
