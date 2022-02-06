import {
  PermissionLevels,
  PermissionLevel,
  Permission,
} from '../types/permission-types';

export const guilds = {
  bestie: '862794834800410654',
  pp: '872562843688517693',
};

export const createPermissionLevel = (permLevel: PermissionLevel) => permLevel;

export const permissionLevels = {
  admin: createPermissionLevel({
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
  }),

  bestie_admin: createPermissionLevel({
    global: [],
    defaultPermissions: false,
    local: {
      [guilds.bestie]: [
        {
          id: '862795463757660211',
          type: 'ROLE',
          permission: true,
        },
      ],
    },
  }),

  mod: createPermissionLevel({
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
  }),

  everyone: createPermissionLevel({
    defaultPermissions: true,
  }),
};

const getPermissionsArrayForSinglePerm = (
  permLevel: PermissionLevel,
  guildId: string
): Permission[] => {
  const global = permLevel.global || [];
  const allLocal = permLevel.local!;

  const local = allLocal[guildId] || [];

  const allPerms = [...global, ...local];

  return allPerms;
};

export const getPermissionsArray = (
  permLevels: PermissionLevel[],
  guildId: string
): Permission[] => {
  return permLevels.flatMap((permLevel) =>
    getPermissionsArrayForSinglePerm(permLevel, guildId)
  );
};
