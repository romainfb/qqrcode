import { useEffect, useState } from 'react'
import { useServices } from '../hooks/useServices'

/**
 * Hook to load an asset from the main process
 * @param assetPath - Relative path to the asset
 * @returns Data URL of the loaded asset, or undefined
 */
export function useAssetLoader(assetPath: string | undefined): string | undefined {
  const [dataUrl, setDataUrl] = useState<string | undefined>()

  const { assetService } = useServices()

  useEffect(() => {
    let raf: number | undefined

    if (assetPath) {
      assetService
        .load(assetPath)
        .then((url) => setDataUrl(url))
        .catch(console.error)
    } else {
      raf = requestAnimationFrame(() => {
        setDataUrl(undefined)
      })
    }

    return () => {
      if (raf !== undefined) {
        cancelAnimationFrame(raf)
      }
    }
  }, [assetPath, assetService])

  return dataUrl
}
