'use client'

import {useState} from 'react'
import type {SettingsQueryResult} from '@/sanity.types'
import {studioUrl} from '@/sanity/lib/api'
import {resolveHref} from '@/sanity/lib/utils'
import {createDataAttribute, stegaClean} from 'next-sanity'
import Link from 'next/link'

interface NavbarProps {
  data: SettingsQueryResult
}

function resolveMenuItemHref(menuItem: any) {
  if (!menuItem) return null

  if (menuItem.kind === 'route') {
    return menuItem.route || null
  }

  if (menuItem.kind === 'external') {
    return menuItem.href || null
  }

  if (menuItem.kind === 'reference') {
    const ref = menuItem.reference
    return resolveHref(ref?._type, ref?.slug) || null
  }

  if (menuItem._type) {
    return resolveHref(menuItem._type, menuItem.slug) || null
  }

  return null
}

function isHomeMenuItem(menuItem: any) {
  if (!menuItem) return false
  if (menuItem.kind === 'route') return menuItem.route === '/'
  if (menuItem.kind === 'reference') return menuItem.reference?._type === 'home'
  return menuItem._type === 'home'
}

export function Navbar(props: NavbarProps) {
  const {data} = props
  const [isOpen, setIsOpen] = useState(false)

  const dataAttribute =
    data?._id && data?._type
      ? createDataAttribute({
          baseUrl: studioUrl,
          id: data._id,
          type: data._type,
        })
      : null

  return (
  <header
    className="sticky top-0 z-[10] bg-white/80 px-4 py-4 backdrop-blur md:px-16 md:py-5 lg:px-32"
    data-sanity={dataAttribute?.('menuItems')}
  >
    <div className="flex items-center justify-end md:hidden">
      <button
        type="button"
        className="text-lg text-gray-600 hover:text-black"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="site-navigation"
        aria-label="Toggle navigation"
      >
        {isOpen ? 'Close' : 'Menu'}
      </button>
    </div>

    <nav
      id="site-navigation"
      className={`mt-4 flex-col gap-3 md:mt-0 md:flex md:flex-row md:flex-wrap md:items-center md:gap-x-5 ${
        isOpen ? 'flex' : 'hidden'
      }`}
    >
      {data?.menuItems?.map((menuItem) => {
        const href = resolveMenuItemHref(menuItem)
        if (!href) return null

        const isHome = isHomeMenuItem(menuItem)
        const isExternal = menuItem?.kind === 'external'
        const label = stegaClean(menuItem?.title) ?? 'Untitled'

        return (
          <Link
            key={menuItem._key}
            className={`text-lg hover:text-black md:text-xl ${
              isHome ? 'font-extrabold text-black' : 'text-gray-600'
            }`}
            data-sanity={dataAttribute?.(['menuItems', {_key: menuItem._key as string}])}
            href={href}
            target={isExternal && menuItem?.openInNewTab ? '_blank' : undefined}
            rel={isExternal && menuItem?.openInNewTab ? 'noreferrer' : undefined}
            onClick={() => setIsOpen(false)}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  </header>
)
}