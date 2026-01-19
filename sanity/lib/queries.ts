import {defineQuery} from 'next-sanity'

export const homePageQuery = defineQuery(`
  *[_type == "home"][0]{
    _id,
    _type,
    overview,
    showcaseProjects[]{
      _key,
      ...@->{
        _id,
        _type,
        coverImage,
        overview,
        "slug": slug.current,
        tags,
        title,
      }
    },
    title,
  }
`)

export const pagesBySlugQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    _type,
    body,
    overview,
    title,
    "slug": slug.current,
  }
`)

export const projectBySlugQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    _type,
    client,
    coverImage,
    description,
    duration,
    overview,
    site,
    "slug": slug.current,
    tags,
    title,
  }
`)

export const settingsQuery = defineQuery(`
  *[_type == "settings"][0]{
    _id,
    _type,
    footer,
    menuItems[]{
      _key,
      ...@->{
        _type,
        "slug": slug.current,
        title
      }
    },
    ogImage,
  }
`)

export const slugsByTypeQuery = defineQuery(`
  *[_type == $type && defined(slug.current)]{"slug": slug.current}
`)


export const projectBySlugAndTagQuery = defineQuery(`
  *[_type == "project" && slug.current == $slug && $tag in tags[]][0]{
    ...,
    "slug": slug.current
  }
`)

export const slugsByTypeAndTagQuery = defineQuery(`
  *[_type == $type && defined(slug.current) && $tag in tags[]]{
    "slug": slug.current
  }
`)

export const projectsByTagQuery = defineQuery(`
  *[_type == "project" && $tag in tags[]]
  | order(coalesce(duration.start, _createdAt) desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    overview,
    coverImage,
    tags,
    duration
  }
`)

