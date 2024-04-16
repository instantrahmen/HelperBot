import type { APIGuild } from 'discord-api-types/v10';
import type { GuildMember, User } from 'discord.js';

// For some reason, importing the Presence or PresenceStatus type from discord.js causes an error, so I'm just getting it here from GuildMember instead
export type PresenceStatus = NonNullable<GuildMember['presence']>['status'];

export type GuildMemberResponse = {
  id: string;
  avatar: string;
  data: GuildMember;
  username: string;
  displayName: string;
  joinedTimestamp: number;
  user: User;
  status: PresenceStatus | null;
};

export type CompleteGuildDataResponse = APIGuild & {
  members: GuildMemberResponse[];
};
