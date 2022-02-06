import { PermissionLevels } from '../types/permission-types';

export const guilds = {
  bestie: '862794834800410654',
  pp: '872562843688517693',
};

export const permissionLevels: PermissionLevels = {
  admin: {
    defaultPermissions: false,
    global: [
      // Aria
      {
        id: '866367674980630588',
        type: 'USER',
        permission: true,
      },

      // Erika
      {
        id: '249449750070427648',
        type: 'USER',
        permission: true,
      },
    ],
    local: {
      [guilds.bestie]: [],
      [guilds.pp]: [],
    },
  },

  mod: {
    defaultPermissions: false,
    global: [
      // Aria
      {
        id: '866367674980630588',
        type: 'USER',
        permission: true,
      },

      // Erika
      {
        id: '249449750070427648',
        type: 'USER',
        permission: true,
      },
    ],
    local: {
      [guilds.bestie]: [],
      [guilds.pp]: [],
    },
  },

  everyone: {
    defaultPermissions: true,
  },
};
