/**
 * Opens a URL in a new tab using a mobile-safe method that prevents
 * the original page from becoming unresponsive on mobile browsers.
 *
 * @param url - The URL to navigate to
 * @param options - Optional configuration
 * @param options.noopener - Whether to add noopener/noreferrer for security (default: true)
 * @param options.onError - Callback function if navigation fails
 * @returns boolean - True if navigation was attempted, false if failed
 *
 * @example
 * // Basic usage
 * navigateToUrl('https://example.com');
 *
 * @example
 * // With error handling
 * navigateToUrl('https://example.com', {
 *   onError: (error) => console.error('Navigation failed:', error)
 * });
 *
 * @example
 * // In a React component
 * const handleClick = () => {
 *   navigateToUrl('https://example.com');
 * };
 */
export const navigateToUrl = (
  url: string,
  options?: {
    noopener?: boolean;
    onError?: (error: Error) => void;
  }
): boolean => {
  const { noopener = true, onError } = options || {};

  try {
    // Validate URL
    if (!url || typeof url !== "string") {
      throw new Error("Invalid URL provided");
    }

    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";

    // Add security attributes if requested
    if (noopener) {
      link.rel = "noopener noreferrer";
    }

    // Position element off-screen to avoid visual artifacts
    link.style.position = "absolute";
    link.style.left = "-9999px";
    link.style.visibility = "hidden";

    // Append to DOM
    document.body.appendChild(link);

    // Create and dispatch a proper click event
    const clickEvent = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });

    link.dispatchEvent(clickEvent);

    // Clean up - remove element from DOM
    document.body.removeChild(link);

    return true;
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));

    // Call error handler if provided
    if (onError) {
      onError(err);
    } else {
      console.error("Navigation failed:", err.message);
    }

    return false;
  }
};

/**
 * Alternative version that returns a Promise for async/await usage
 *
 * @example
 * await navigateToUrlAsync('https://example.com');
 * console.log('Navigation initiated');
 */
export const navigateToUrlAsync = async (
  url: string,
  options?: {
    noopener?: boolean;
  }
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const success = navigateToUrl(url, {
      ...options,
      onError: reject,
    });

    if (success) {
      resolve();
    } else {
      reject(new Error("Navigation failed"));
    }
  });
};

/**
 * React Hook version for easy integration
 *
 * @example
 * function MyComponent() {
 *   const navigate = useNavigateToUrl();
 *
 *   const handleClick = () => {
 *     navigate('https://example.com');
 *   };
 *
 *   return <button onClick={handleClick}>Open Link</button>;
 * }
 */
export const useNavigateToUrl = () => {
  return (
    url: string,
    options?: { noopener?: boolean; onError?: (error: Error) => void }
  ) => {
    return navigateToUrl(url, options);
  };
};
