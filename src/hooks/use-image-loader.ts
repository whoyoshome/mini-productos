import { useState, useEffect, useMemo } from "react";
import { normalizeUrl, shouldProxy } from "@/lib/url";
import { placeholderSvg } from "@/lib/placeholder";

export function useImageLoader(
  imageUrl: string,
  fallbackLabel: string,
  timeout: number
) {
  const raw = useMemo(() => normalizeUrl(imageUrl), [imageUrl]);
  const proxied = useMemo(() => {
    if (shouldProxy(raw)) {
      return `/api/image?u=${encodeURIComponent(raw)}&label=Image`;
    }
    return raw;
  }, [raw]);

  const [src, setSrc] = useState<string>(proxied);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  
  useEffect(() => {
    setSrc(proxied);
    setLoaded(false);
    setFailed(false);
    const img = new Image();
    img.src = proxied;
    if (img.complete) setLoaded(true);
  }, [proxied]);

  useEffect(() => {
    if (loaded || failed) return;
    const t = setTimeout(() => {
      if (!loaded) {
        setFailed(true);
        setSrc(placeholderSvg(fallbackLabel));
        setLoaded(true);
      }
    }, timeout);
    return () => clearTimeout(t);
  }, [loaded, failed, fallbackLabel, timeout]);

  const handleLoad = () => {
    setLoaded(true);
  };

  const handleError = () => {
    if (!failed) {
      setFailed(true);
      setSrc(placeholderSvg(fallbackLabel));
      setLoaded(true);
    }
  };

  return {
    src,
    loaded,
    failed,
    onLoad: handleLoad,
    onError: handleError,
  };
}
