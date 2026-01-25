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
    // Prefer `images[]` for the lightbox; fall back to coverImage if images is empty.
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
    if (!activeImages.length) return
    setOpenImageIndex((i) => (i + 1) % activeImages.length)
  }

  function prev() {
    if (!activeImages.length) return
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
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = originalOverflow
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
            className="overflow-hidden rounded-md border text-left hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-black/20"
          >
            <ImageBox image={work.coverImage} alt="" classesWrapper="relative aspect-[16/9]" />
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onMouseDown={(e) => {
            // Click outside to close (only if clicking the backdrop)
            if (e.target === e.currentTarget) close()
          }}
        >
          <div className="relative w-full max-w-5xl">
            {/* Close button */}
            <button
              type="button"
              onClick={close}
              className="absolute right-2 top-2 z-10 rounded-md bg-black/60 px-3 py-2 text-sm text-white hover:bg-black/80"
            >
              Close
            </button>

            {/* Image */}
            <div className="overflow-hidden rounded-md bg-black">
              <ImageBox
                image={activeImages[openImageIndex]}
                alt=""
                classesWrapper="relative aspect-[16/9]"
              />
            </div>

            {/* Controls */}
            <div className="mt-3 flex items-center justify-between gap-3 text-white">
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

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prev}
                  className="rounded-md bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
                >
                  ←
                </button>
                <div className="text-sm text-white/80">
                  {activeImages.length ? openImageIndex + 1 : 0}/{activeImages.length}
                </div>
                <button
                  type="button"
                  onClick={next}
                  className="rounded-md bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
                >
                  →
                </button>
              </div>
            </div>

            <div className="mt-2 text-xs text-white/60">Tip: use ← → keys, Esc to close</div>
          </div>
        </div>
      ) : null}
    </>
  )
}
