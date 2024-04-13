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
