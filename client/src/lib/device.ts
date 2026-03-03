/**
 * Mobile & Multi-Device Utilities
 * Helpers for optimizing the app experience across different devices
 */

export const isMobile = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

export const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

export const isStandalone = (): boolean => {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
};

/**
 * Detect if user is online or offline
 */
export const isOnline = (): boolean => navigator.onLine;

/**
 * Request fullscreen for immersive mobile experience
 */
export const requestFullscreen = (): void => {
  const element = document.documentElement;
  if (element.requestFullscreen) {
    element.requestFullscreen().catch((err) => {
      console.log("Fullscreen request failed:", err);
    });
  }
};

/**
 * Hide address bar on mobile browsers
 */
export const hideAddressBar = (): void => {
  if (window.scrollY === 0) {
    window.scrollBy(0, 1);
  }
};

/**
 * Handle device orientation changes
 */
export const onOrientationChange = (callback: (portrait: boolean) => void): void => {
  const handleChange = (): void => {
    callback(window.innerHeight > window.innerWidth);
  };

  window.addEventListener("orientationchange", handleChange);
  window.addEventListener("resize", handleChange);

  // Call once to initialize
  handleChange();
};

/**
 * Vibrate for haptic feedback (mobile)
 */
export const vibrate = (pattern: number | number[] = 100): void => {
  if ("vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
};

/**
 * Trigger offline/online sync
 */
export const setupNetworkListeners = (): void => {
  window.addEventListener("online", () => {
    console.log("App is now online");
    // Trigger data sync
    window.dispatchEvent(new Event("app:online"));
  });

  window.addEventListener("offline", () => {
    console.log("App is now offline");
    window.dispatchEvent(new Event("app:offline"));
  });
};

/**
 * Get network information (if available)
 */
export const getNetworkInfo = (): {
  type: string;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
} => {
  const connection =
    (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

  if (connection) {
    return {
      type: connection.type || "unknown",
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData,
    };
  }

  return { type: "unknown" };
};

/**
 * Check available storage
 */
export const checkStorageQuota = async (): Promise<{
  usage: number;
  quota: number;
  percentage: number;
}> => {
  if ("storage" in navigator && "estimate" in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    return {
      usage: estimate.usage || 0,
      quota: estimate.quota || 0,
      percentage: ((estimate.usage || 0) / (estimate.quota || 1)) * 100,
    };
  }
  return { usage: 0, quota: 0, percentage: 0 };
};

/**
 * Request persistent storage (for better offline support)
 */
export const requestPersistentStorage = async (): Promise<boolean> => {
  if ("storage" in navigator && "persist" in navigator.storage) {
    return await navigator.storage.persist();
  }
  return false;
};
