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
