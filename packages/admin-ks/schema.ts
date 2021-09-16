import { createSchema, list } from '@keystone-next/keystone';
import {
  text,
  relationship,
  password,
  timestamp,
  select,
} from '@keystone-next/keystone/fields';
import { document } from '@keystone-next/fields-document';

export const lists = createSchema({
  User: list({
    ui: {
      listView: {
        initialColumns: ['name', 'posts'],
      },
    },
    fields: {
      name: text({ isRequired: true }),
      email: text({
        isRequired: true,
        isIndexed: 'unique',
        isFilterable: true,
      }),
      password: password({ isRequired: true }),
      posts: relationship({ ref: 'Post.author', many: true }),
    },
  }),
  Post: list({
    fields: {
      title: text(),
      status: select({
        options: [
          { label: 'Published', value: 'published' },
          { label: 'Draft', value: 'draft' },
        ],
        ui: {
          displayMode: 'segmented-control',
        },
      }),
      content: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),
      publishDate: timestamp(),
      author: relationship({
        ref: 'User.posts',
        ui: {
          displayMode: 'cards',
          cardFields: ['name', 'email'],
          inlineEdit: { fields: ['name', 'email'] },
          linkToItem: true,
          inlineCreate: { fields: ['name', 'email'] },
        },
      }),
      tags: relationship({
        ref: 'Tag.posts',
        ui: {
          displayMode: 'cards',
          cardFields: ['name'],
          inlineEdit: { fields: ['name'] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ['name'] },
        },
        many: true,
      }),
    },
  }),
  Tag: list({
    ui: {
      isHidden: true,
    },
    fields: {
      name: text(),
      posts: relationship({
        ref: 'Post.tags',
        many: true,
      }),
    },
  }),

  // model Command {
  //   id          String     @id @default(uuid())
  //   name        String
  //   description String?
  //   payloadType String
  //   payload     String
  //   options     OptionType
  // }
  Command: list({
    fields: {
      name: text(),
      description: text(),
      payloadType: select({
        options: [
          { label: 'Text', value: 'text' },
          { label: 'EJS', value: 'ejs' },
        ],
        ui: {
          displayMode: 'segmented-control',
        },
      }),
      payload: text(),
      // publishDate: timestamp(),

      // tags: relationship({
      //   ref: 'Tag.posts',
      //   ui: {
      //     displayMode: 'cards',
      //     cardFields: ['name'],
      //     inlineEdit: { fields: ['name'] },
      //     linkToItem: true,
      //     inlineConnect: true,
      //     inlineCreate: { fields: ['name'] },
      //   },
      //   many: true,
      // }),
    },
  }),
});
