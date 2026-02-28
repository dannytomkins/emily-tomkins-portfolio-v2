import {urlForImage} from '@/sanity/lib/utils'
import Image from 'next/image'
import {getImageDimensions} from '@sanity/asset-utils'

interface ImageBoxProps {
  image?: {asset?: any}
  alt?: string
  size?: string
  classesWrapper?: string
  'data-sanity'?: string
  fit?: 'cover' | 'contain'
  mode?: 'fillBox' | 'natural'
}

export default function ImageBox({
  image,
  alt = 'Cover image',
  size = '100vw',
  classesWrapper = '',
  fit = 'cover',
  mode = 'fillBox',
  ...props
}: ImageBoxProps) {
  if (!image?.asset) return null

  // ✅ Pull true pixel dimensions from the Sanity image asset
  const {width, height} = getImageDimensions(image)

  // Build a reasonable URL (no forced cropping when contain)
  const builder = urlForImage(image)
  const imageUrl =
    builder?.fit(fit === 'contain' ? 'max' : 'crop').url() || null

  if (!imageUrl) return null

  // Natural mode: intrinsic ratio based on REAL width/height
  if (mode === 'natural') {
    return (
      <div className={`w-full ${classesWrapper}`} data-sanity={props['data-sanity']}>
        <Image
          alt={alt}
          src={imageUrl}
          width={width}
          height={height}
          sizes={size}
          className="mx-auto h-auto max-h-[80vh] w-auto max-w-full"
        />
      </div>
    )
  }

  // FillBox mode: fixed box (aspect-* or h-*) + object-fit controls cropping
  return (
    <div
      className={`relative w-full overflow-hidden rounded-[3px] bg-gray-50 ${classesWrapper}`}
      data-sanity={props['data-sanity']}
    >
      <Image
        alt={alt}
        src={imageUrl}
        fill
        sizes={size}
        className={fit === 'contain' ? 'object-contain' : 'object-cover'}
      />
    </div>
  )
}