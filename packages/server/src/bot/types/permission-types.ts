export type PermissionLevels = {
  [name: string]: PermissionLevel;
};

export type PermissionLevel = {
  defaultPermissions: boolean;
  global?: Permission[];
  local?: LocalPermissions;
};

export type LocalPermissions = {
  [guildId: string]: Permission[];
};

export type Permission = {
  id: string;
  type: 'ROLE' | 'USER';
  permission: boolean;
};
