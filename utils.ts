export let wakeLock;

// Function that attempts to request a screen wake lock.
export const requestWakeLock = async () => {
  console.log("Requesting wakelock");
  try {
    wakeLock = await navigator.wakeLock.request();
    wakeLock.addEventListener("release", () => {
      console.log("Screen Wake Lock released:", wakeLock.released);
    });
    console.log("Screen Wake Lock released:", wakeLock.released);
    return wakeLock;
  } catch (err) {
    console.error(`${err.name}, ${err.message}`);
  }
};

export const handleVisibilityChange = async () => {
  console.log("Handling visibility change", wakeLock);
  if (wakeLock !== null && document.visibilityState === "visible") {
    await requestWakeLock();
  }
};

const __vars = new Set();

export const globalAccess = (options) => {
  if (Object.keys(options).length != 1) throw new Error("Wrong!");
  const key = Object.keys(options)[0];
  const value = options[key];
  if (globalThis[key] === undefined) {
    console.log(`Setting global ${key}=${value}`);
    __vars.add(key);
    globalThis[key] = value;
  }
  return globalThis[key];
};

export const read = (v: any) => {
  if (typeof v === "function") {
    console.log(`Returning function ${v}`);
    return v();
  }
  return v;
};

globalAccess.read = read;

globalThis.vars = () => {
  const output = {};
  __vars.forEach((key: any) => (output[key] = globalThis[key]));
  console.table(output);
  return output;
};

export class LimitedQueue {
  size: number;
  timeline: Array<string>;
  spectrum: Map<string, number>;

  constructor(size: number) {
    this.size = size;
    this.timeline = [];
    this.spectrum = new Map();
  }

  enqueue(item) {
    if (this.timeline.length >= this.size) {
      this.timeline.shift();
    }
    this.timeline.push(item);
    if (item !== undefined && !this.spectrum.has(item)) {
      const hsv = hexToHsv(item);
      this.spectrum.set(item, hsv[0]);
      const hue = hsv[0];
      const saturation = hsv[1];
      const value = hsv[2];
      const satv = saturation * value;
      console.log(
        `Updated spectrum hex=${item}, h=${hue}, s=${saturation}, v=${value}, s*v=${satv}`
      );
    }
    this.displayQueue();
  }

  dequeue() {
    const item = this.timeline.shift();
    this.displayQueue();
    return item;
  }

  getQueue() {
    return this.timeline;
  }

  displayQueue() {
    const timeline = document.getElementById("timeline-container");
    timeline.innerHTML = ""; // Clear the container

    this.timeline.forEach((color) => {
      const circle = document.createElement("div");
      circle.style.width = "20px";
      circle.style.height = "20px";
      circle.style.borderRadius = "20%";
      circle.style.backgroundColor = color;
      timeline.appendChild(circle);
    });

    const spectrum = document.getElementById("spectrum-container");
    spectrum.innerHTML = ""; // Clear the container

    const sortedSpectrum = Array.from(this.spectrum.entries())
      .sort((a, b) => a[1] - b[1])
      .map((entry) => entry[0]);

    sortedSpectrum.forEach((color) => {
      const circle = document.createElement("div");
      circle.style.width = "20px";
      circle.style.height = "20px";
      circle.style.borderRadius = "20%";
      circle.style.backgroundColor = color;
      spectrum.appendChild(circle);
    });
  }
}

function hexToHsv(hex: string) {
  let r = 0,
    g = 0,
    b = 0;

  // 3 digits
  if (hex.length == 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  }
  // 6 digits
  else if (hex.length == 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }

  r /= 255;
  g /= 255;
  b /= 255;

  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    v = max;

  let d = max - min;
  s = max == 0 ? 0 : d / max;

  if (max == min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h, s, v];
}
