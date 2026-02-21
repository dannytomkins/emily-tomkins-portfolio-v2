import {CogIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  // Uncomment below to have edits publish automatically as you type
  // liveEdit: true,
  fields: [
    defineField({
      name: 'menuItems',
      title: 'Menu Item list',
      description: 'Links displayed on the header of your site.',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'menuItem',
          title: 'Menu Item',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'kind',
              title: 'Link type',
              type: 'string',
              options: {
                list: [
                  {title: 'Internal route (e.g. /portfolio)', value: 'route'},
                  {title: 'Reference (page/project/etc.)', value: 'reference'},
                  {title: 'External URL', value: 'external'},
                ],
                layout: 'radio',
              },
              initialValue: 'route',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'route',
              title: 'Internal route',
              description: 'Use a leading slash. Example: /portfolio',
              type: 'string',
              hidden: ({parent}) => parent?.kind !== 'route',
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const kind = (context.parent as any)?.kind
                  if (kind !== 'route') return true
                  if (!value) return 'Route is required'
                  if (typeof value === 'string' && value.startsWith('/')) return true
                  return 'Route must start with "/" (example: /portfolio)'
                }),
            }),
            defineField({
              name: 'reference',
              title: 'Reference',
              type: 'reference',
              to: [{type: 'home'}, {type: 'page'}, {type: 'project'}, {type: 'work'}],
              hidden: ({parent}) => parent?.kind !== 'reference',
            }),
            defineField({
              name: 'href',
              title: 'External URL',
              type: 'url',
              hidden: ({parent}) => parent?.kind !== 'external',
            }),
            defineField({
              name: 'openInNewTab',
              title: 'Open in new tab',
              type: 'boolean',
              initialValue: false,
              hidden: ({parent}) => parent?.kind !== 'external',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              kind: 'kind',
              route: 'route',
              href: 'href',
            },
            prepare({title, kind, route, href}) {
              const subtitle = kind === 'route' ? route : kind === 'external' ? href : 'Reference'
              return {title, subtitle}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'footer',
      description: 'This is a block of text that will be displayed at the bottom of the page.',
      title: 'Footer Info',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          marks: {
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'Url',
                  },
                ],
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Displayed on social cards and search engine results.',
      options: {
        hotspot: true,
      },
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Settings',
        subtitle: 'Menu Items, Footer Info, and Open Graph Image',
      }
    },
  },
})
