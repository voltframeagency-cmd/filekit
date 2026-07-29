import React from 'react';
import { fileKitAssets, FileKitAssetName } from './assetRegistry';

export interface FileKitAssetProps {
  name: FileKitAssetName;
  className?: string;
  alt?: string;
  decorative?: boolean;
  priority?: boolean;
}

export const FileKitAsset: React.FC<FileKitAssetProps> = ({
  name,
  className = 'h-auto w-full max-w-[240px]',
  alt,
  decorative = false,
  priority = false,
}) => {
  const asset = fileKitAssets[name];

  if (!asset) {
    console.warn(`[FileKitAsset] Asset "${name}" not found in registry.`);
    return null;
  }

  const effectiveAlt = decorative ? '' : alt ?? asset.alt;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset.path}
      alt={effectiveAlt}
      aria-hidden={decorative ? true : undefined}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={className}
    />
  );
};
