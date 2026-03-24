import {OptimisticSortOrder} from '@/components/OptimisticSortOrder'
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

  // Backwards compatibility: if old data still exists
  if (menuItem._type) {
    return resolveHref(menuItem._type, menuItem.slug) || null
  }

  return null
}

function isHomeMenuItem(menuItem: any) {
  if (!menuItem) return false
  if (menuItem.kind === 'route') return menuItem.route === '/'
  if (menuItem.kind === 'reference') return menuItem.reference?._type === 'home'
  // old shape
  return menuItem._type === 'home'
}

export function Navbar(props: NavbarProps) {
  const {data} = props
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
  className="sticky top-0 z-10 flex flex-wrap items-center gap-x-5 bg-white/80 px-4 py-4 backdrop-blur md:px-16 md:py-5 lg:px-32"
  data-sanity={dataAttribute?.('menuItems')}
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
      >
        {label}
      </Link>
    )
  })}
</header>
  )
}