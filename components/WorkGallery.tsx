'use client'

import ImageBox from '@/components/ImageBox'
import {useEffect, useMemo, useState} from 'react'

type Work = {
  _id: string
  title: string | null
  overview: string | null
  year: number | null
  coverImage: any | null
  images: any[] | null
}

export function WorkGallery({works}: {works: Work[]}) {
  const [openWorkIndex, setOpenWorkIndex] = useState<number | null>(null)
  const [openImageIndex, setOpenImageIndex] = useState<number>(0)

  const isOpen = openWorkIndex !== null

  const activeWork = useMemo(() => {
    if (openWorkIndex === null) return null
    return works[openWorkIndex] ?? null
  }, [openWorkIndex, works])

  const activeImages = useMemo(() => {
    if (!activeWork) return []
    const imgs = (activeWork.images ?? []).filter(Boolean)
    return imgs.length > 0 ? imgs : activeWork.coverImage ? [activeWork.coverImage] : []
  }, [activeWork])

  function open(workIdx: number, imgIdx = 0) {
    setOpenWorkIndex(workIdx)
    setOpenImageIndex(imgIdx)
  }

  function close() {
    setOpenWorkIndex(null)
    setOpenImageIndex(0)
  }

  function next() {
    if (activeImages.length <= 1) return
    setOpenImageIndex((i) => (i + 1) % activeImages.length)
  }

  function prev() {
    if (activeImages.length <= 1) return
    setOpenImageIndex((i) => (i - 1 + activeImages.length) % activeImages.length)
  }

  // Keyboard + scroll lock
  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }

    document.addEventListener('keydown', onKeyDown)

    const originalBodyOverflow = document.body.style.overflow
    const originalHtmlOverflow = document.documentElement.style.overflow

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const preventTouchMove = (e: TouchEvent) => {
      e.preventDefault()
    }
    document.addEventListener('touchmove', preventTouchMove, {passive: false})

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('touchmove', preventTouchMove)

      document.body.style.overflow = originalBodyOverflow
      document.documentElement.style.overflow = originalHtmlOverflow
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, activeImages.length])

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {works?.map((work, idx) => (
          <button
            key={work._id}
            type="button"
            onClick={() => open(idx, 0)}
            className="cursor-pointer overflow-hidden rounded-md border bg-white text-left transition hover:-translate-y-[1px] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-black/20"
          >
            <ImageBox
              image={work.coverImage}
              alt={work.title ?? ''}
              fit="contain"
              mode="fillBox"
              classesWrapper="aspect-[16/9] bg-gray-50"
            />
            <div className="p-4">
              <div className="text-lg font-medium">{work.title ?? 'Untitled'}</div>
              {work.year ? <div className="text-sm opacity-70">{work.year}</div> : null}
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {isOpen && activeWork ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close()
          }}
        >
          <div className="relative w-full max-w-5xl">
            {/* Close button */}
            <button
              type="button"
              onClick={close}
              aria-label="Close lightbox"
              className="absolute right-2 top-2 z-10 rounded-md bg-black/60 px-3 py-2 text-sm text-white transition hover:bg-black/80"
            >
              Close
            </button>

            {/* Main image frame */}
            <div className="relative w-full rounded-md bg-black">
              <div className="relative h-[80vh] w-full">
                <button
                  type="button"
                  onClick={next}
                  className="block h-full w-full cursor-default"
                  aria-label={
                    activeImages.length > 1 ? 'Advance to next image' : 'Image preview'
                  }
                >
                  <ImageBox
                    image={activeImages[openImageIndex]}
                    alt={activeWork.title ?? ''}
                    fit="contain"
                    mode="fillBox"
                    classesWrapper="h-full w-full"
                    size="(max-width: 1024px) 100vw, 1024px"
                  />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            {activeImages.length > 1 ? (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {activeImages.map((image, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setOpenImageIndex(idx)}
                    aria-label={`View image ${idx + 1}`}
                    className={`relative h-16 w-16 overflow-hidden rounded border transition ${
                      idx === openImageIndex
                        ? 'border-white ring-2 ring-white'
                        : 'border-white/30 hover:border-white/60'
                    }`}
                  >
                    <ImageBox
                      image={image}
                      alt=""
                      fit="contain"
                      mode="fillBox"
                      classesWrapper="h-full w-full bg-black"
                      size="64px"
                    />
                  </button>
                ))}
              </div>
            ) : null}

            {/* Controls / caption */}
            <div className="mt-3 flex min-h-[3.5rem] items-center justify-between gap-3 text-white">
              <div className="min-w-0">
                <div className="truncate text-base font-medium">
                  {activeWork.title ?? 'Untitled'}
                </div>

                {activeWork.overview ? (
                  <div className="mt-1 line-clamp-2 text-sm text-white/80">
                    {activeWork.overview}
                  </div>
                ) : null}
              </div>

              {activeImages.length > 1 ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={prev}
                    aria-label="Previous image"
                    className="rounded-md bg-white/10 px-3 py-2 text-sm transition hover:bg-white/20"
                  >
                    ←
                  </button>
                  <div className="text-sm text-white/80">
                    {openImageIndex + 1}/{activeImages.length}
                  </div>
                  <button
                    type="button"
                    onClick={next}
                    aria-label="Next image"
                    className="rounded-md bg-white/10 px-3 py-2 text-sm transition hover:bg-white/20"
                  >
                    →
                  </button>
                </div>
              ) : null}
            </div>

            <div className="mt-2 text-xs text-white/60">
              {activeImages.length > 1
                ? 'Tip: click the image or use ← → keys, Esc to close'
                : 'Tip: press Esc to close'}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}