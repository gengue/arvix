/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Authorigins = "_authOrigins",
	Externalauths = "_externalAuths",
	Mfas = "_mfas",
	Otps = "_otps",
	Superusers = "_superusers",
	Clients = "clients",
	OrganizationMembership = "organizationMembership",
	Organizations = "organizations",
	Projects = "projects",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
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

export type AuthoriginsRecord = {
	collectionRef: string
	created?: IsoDateString
	fingerprint: string
	id: string
	recordRef: string
	updated?: IsoDateString
}

export type ExternalauthsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	provider: string
	providerId: string
	recordRef: string
	updated?: IsoDateString
}

export type MfasRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	method: string
	recordRef: string
	updated?: IsoDateString
}

export type OtpsRecord = {
	collectionRef: string
	created?: IsoDateString
	id: string
	password: string
	recordRef: string
	sentTo?: string
	updated?: IsoDateString
}

export type SuperusersRecord = {
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

export type ClientsRecord = {
	created?: IsoDateString
	id: string
	logo?: string
	name: string
	orgId: RecordIdString
	slug?: string
	updated?: IsoDateString
}

export enum OrganizationMembershipRoleOptions {
	"Admin" = "Admin",
	"Manager" = "Manager",
	"Staff" = "Staff",
	"Client" = "Client",
}
export type OrganizationMembershipRecord = {
	created?: IsoDateString
	id: string
	orgId?: RecordIdString
	role?: OrganizationMembershipRoleOptions
	updated?: IsoDateString
	userId?: RecordIdString
}

export type OrganizationsRecord = {
	created?: IsoDateString
	id: string
	logo?: string
	name: string
	slug: string
	updated?: IsoDateString
}

export enum ProjectsTypeOptions {
	"SingleTower" = "SingleTower",
	"MultiTower" = "MultiTower",
	"Neighbourhood" = "Neighbourhood",
	"other" = "other",
}
export type ProjectsRecord<Tlocation = unknown> = {
	clientId: RecordIdString
	contentDisclaimer?: HTMLString
	coverImg?: string
	coverVideoUrl?: string
	created?: IsoDateString
	ctaEnterText?: string
	description?: HTMLString
	id: string
	isPublished?: boolean
	location?: null | Tlocation
	logo?: string
	mainColor?: string
	name: string
	privacyPolicy?: HTMLString
	secondaryColor?: string
	seoDescription?: string
	seoTitle?: string
	slug: string
	type: ProjectsTypeOptions
	updated?: IsoDateString
}

export type UsersRecord = {
	avatar?: string
	created?: IsoDateString
	email: string
	emailVisibility?: boolean
	id: string
	name?: string
	password: string
	tokenKey: string
	updated?: IsoDateString
	verified?: boolean
}

// Response types include system fields and match responses from the PocketBase API
export type AuthoriginsResponse<Texpand = unknown> = Required<AuthoriginsRecord> & BaseSystemFields<Texpand>
export type ExternalauthsResponse<Texpand = unknown> = Required<ExternalauthsRecord> & BaseSystemFields<Texpand>
export type MfasResponse<Texpand = unknown> = Required<MfasRecord> & BaseSystemFields<Texpand>
export type OtpsResponse<Texpand = unknown> = Required<OtpsRecord> & BaseSystemFields<Texpand>
export type SuperusersResponse<Texpand = unknown> = Required<SuperusersRecord> & AuthSystemFields<Texpand>
export type ClientsResponse<Texpand = unknown> = Required<ClientsRecord> & BaseSystemFields<Texpand>
export type OrganizationMembershipResponse<Texpand = unknown> = Required<OrganizationMembershipRecord> & BaseSystemFields<Texpand>
export type OrganizationsResponse<Texpand = unknown> = Required<OrganizationsRecord> & BaseSystemFields<Texpand>
export type ProjectsResponse<Tlocation = unknown, Texpand = unknown> = Required<ProjectsRecord<Tlocation>> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	clients: ClientsRecord
	organizationMembership: OrganizationMembershipRecord
	organizations: OrganizationsRecord
	projects: ProjectsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	clients: ClientsResponse
	organizationMembership: OrganizationMembershipResponse
	organizations: OrganizationsResponse
	projects: ProjectsResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: '_authOrigins'): RecordService<AuthoriginsResponse>
	collection(idOrName: '_externalAuths'): RecordService<ExternalauthsResponse>
	collection(idOrName: '_mfas'): RecordService<MfasResponse>
	collection(idOrName: '_otps'): RecordService<OtpsResponse>
	collection(idOrName: '_superusers'): RecordService<SuperusersResponse>
	collection(idOrName: 'clients'): RecordService<ClientsResponse>
	collection(idOrName: 'organizationMembership'): RecordService<OrganizationMembershipResponse>
	collection(idOrName: 'organizations'): RecordService<OrganizationsResponse>
	collection(idOrName: 'projects'): RecordService<ProjectsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
