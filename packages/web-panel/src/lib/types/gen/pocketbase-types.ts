/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Commands = "commands",
	Guilds = "guilds",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type CommandsRecord<Tdata = unknown> = {
	created_by?: RecordIdString
	data?: null | Tdata
	guild?: RecordIdString
	name?: string
}

export type GuildsRecord = {
	guild_id?: string
	name?: string
}

export type UsersRecord<Tmeta = unknown, Tstate = unknown> = {
	active_guild?: string
	avatar?: string
	discord_avatar?: string
	meta?: null | Tmeta
	name?: string
	state?: null | Tstate
}

// Response types include system fields and match responses from the PocketBase API
export type CommandsResponse<Tdata = unknown, Texpand = unknown> = Required<CommandsRecord<Tdata>> & BaseSystemFields<Texpand>
export type GuildsResponse<Texpand = unknown> = Required<GuildsRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Tmeta = unknown, Tstate = unknown, Texpand = unknown> = Required<UsersRecord<Tmeta, Tstate>> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	commands: CommandsRecord
	guilds: GuildsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	commands: CommandsResponse
	guilds: GuildsResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'commands'): RecordService<CommandsResponse>
	collection(idOrName: 'guilds'): RecordService<GuildsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
