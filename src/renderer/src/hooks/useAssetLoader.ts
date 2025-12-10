import { useEffect, useState } from 'react'

/**
 * Hook to load an asset from the main process
 * @param assetPath - Relative path to the asset
 * @returns Data URL of the loaded asset, or undefined
 */
export function useAssetLoader(assetPath: string | undefined): string | undefined {
  const [dataUrl, setDataUrl] = useState<string | undefined>()

  useEffect(() => {
    if (assetPath) {
      window.api.asset
        .load(assetPath)
        .then((url) => setDataUrl(url))
        .catch(console.error)
    } else {
      setDataUrl(undefined)
    }
  }, [assetPath])

  return dataUrl
}
