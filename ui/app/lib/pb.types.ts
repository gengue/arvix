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
	Amenities = "amenities",
	Availabilities = "availabilities",
	Clients = "clients",
	Features = "features",
	OrganizationMembership = "organizationMembership",
	Organizations = "organizations",
	ProjectClients = "projectClients",
	Projects = "projects",
	Structures = "structures",
	Transitions = "transitions",
	Typologies = "typologies",
	TypologyFeatures = "typologyFeatures",
	UnitFeatures = "unitFeatures",
	Units = "units",
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

export enum AmenitiesResourceTypeOptions {
	"Gallery" = "Gallery",
	"Tour360" = "Tour360",
}
export type AmenitiesRecord = {
	created?: IsoDateString
	ico?: string
	id: string
	img?: string
	label: string
	project: RecordIdString
	resourceType: AmenitiesResourceTypeOptions
	updated?: IsoDateString
	url?: string
}

export enum AvailabilitiesStatusOptions {
	"Available" = "Available",
	"Reserved" = "Reserved",
	"Sold" = "Sold",
}
export type AvailabilitiesRecord = {
	created?: IsoDateString
	id: string
	status: AvailabilitiesStatusOptions
	unit: RecordIdString
	updated?: IsoDateString
}

export type ClientsRecord = {
	created?: IsoDateString
	id: string
	logo?: string
	name: string
	orgId: RecordIdString
	slug: string
	updated?: IsoDateString
}

export enum FeaturesValueTypeOptions {
	"int" = "int",
	"bool" = "bool",
	"decimal" = "decimal",
	"text" = "text",
}
export type FeaturesRecord = {
	created?: IsoDateString
	id: string
	name: string
	project: RecordIdString
	updated?: IsoDateString
	valueType: FeaturesValueTypeOptions
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
	orgId: RecordIdString
	role?: OrganizationMembershipRoleOptions
	updated?: IsoDateString
	userId: RecordIdString
}

export type OrganizationsRecord = {
	created?: IsoDateString
	id: string
	logo?: string
	name: string
	slug: string
	updated?: IsoDateString
}

export type ProjectClientsRecord = {
	created?: IsoDateString
	id: string
	updated?: IsoDateString
	userClient: RecordIdString
}

export enum ProjectsTypeOptions {
	"SingleTower" = "SingleTower",
	"MultiTower" = "MultiTower",
	"Neighbourhood" = "Neighbourhood",
	"other" = "other",
}
export type ProjectsRecord<Tlocation = unknown> = {
	client: RecordIdString
	contentDisclaimer?: HTMLString
	coverImg?: string
	coverVideoUrl?: string
	created?: IsoDateString
	ctaEnterText?: string
	description?: HTMLString
	id: string
	introImg?: string
	introTransitionVideo?: string
	isPublished: boolean
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

export type StructuresRecord<Tmeta = unknown> = {
	created?: IsoDateString
	id: string
	img?: string
	meta?: null | Tmeta
	name: string
	order: number
	parent?: RecordIdString
	project: RecordIdString
	slug: string
	updated?: IsoDateString
}

export type TransitionsRecord<Tmeta = unknown> = {
	backwardVideo?: string
	created?: IsoDateString
	forwardVideo?: string
	id: string
	img: string
	meta?: null | Tmeta
	order: number
	project: RecordIdString
	topVideo?: string
	updated?: IsoDateString
}

export type TypologiesRecord = {
	basePrice?: number
	created?: IsoDateString
	id: string
	name?: string
	project?: RecordIdString
	slug: string
	updated?: IsoDateString
}

export type TypologyFeaturesRecord = {
	created?: IsoDateString
	feature: RecordIdString
	id: string
	order?: number
	typology: RecordIdString
	updated?: IsoDateString
	value?: string
}

export type UnitFeaturesRecord = {
	created?: IsoDateString
	feature: RecordIdString
	id: string
	order?: number
	unit: RecordIdString
	updated?: IsoDateString
	value?: string
}

export enum UnitsTypeOptions {
	"Apartment" = "Apartment",
	"House" = "House",
	"Amenity" = "Amenity",
}
export type UnitsRecord<Tmeta = unknown> = {
	created?: IsoDateString
	gallery?: string[]
	id: string
	label?: string
	meta?: null | Tmeta
	name: string
	plansImg?: string
	price?: number
	slug: string
	structure: RecordIdString
	tour360?: string
	type: UnitsTypeOptions
	typology?: RecordIdString
	updated?: IsoDateString
	views?: string[]
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
export type AmenitiesResponse<Texpand = unknown> = Required<AmenitiesRecord> & BaseSystemFields<Texpand>
export type AvailabilitiesResponse<Texpand = unknown> = Required<AvailabilitiesRecord> & BaseSystemFields<Texpand>
export type ClientsResponse<Texpand = unknown> = Required<ClientsRecord> & BaseSystemFields<Texpand>
export type FeaturesResponse<Texpand = unknown> = Required<FeaturesRecord> & BaseSystemFields<Texpand>
export type OrganizationMembershipResponse<Texpand = unknown> = Required<OrganizationMembershipRecord> & BaseSystemFields<Texpand>
export type OrganizationsResponse<Texpand = unknown> = Required<OrganizationsRecord> & BaseSystemFields<Texpand>
export type ProjectClientsResponse<Texpand = unknown> = Required<ProjectClientsRecord> & BaseSystemFields<Texpand>
export type ProjectsResponse<Tlocation = unknown, Texpand = unknown> = Required<ProjectsRecord<Tlocation>> & BaseSystemFields<Texpand>
export type StructuresResponse<Tmeta = unknown, Texpand = unknown> = Required<StructuresRecord<Tmeta>> & BaseSystemFields<Texpand>
export type TransitionsResponse<Tmeta = unknown, Texpand = unknown> = Required<TransitionsRecord<Tmeta>> & BaseSystemFields<Texpand>
export type TypologiesResponse<Texpand = unknown> = Required<TypologiesRecord> & BaseSystemFields<Texpand>
export type TypologyFeaturesResponse<Texpand = unknown> = Required<TypologyFeaturesRecord> & BaseSystemFields<Texpand>
export type UnitFeaturesResponse<Texpand = unknown> = Required<UnitFeaturesRecord> & BaseSystemFields<Texpand>
export type UnitsResponse<Tmeta = unknown, Texpand = unknown> = Required<UnitsRecord<Tmeta>> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	_authOrigins: AuthoriginsRecord
	_externalAuths: ExternalauthsRecord
	_mfas: MfasRecord
	_otps: OtpsRecord
	_superusers: SuperusersRecord
	amenities: AmenitiesRecord
	availabilities: AvailabilitiesRecord
	clients: ClientsRecord
	features: FeaturesRecord
	organizationMembership: OrganizationMembershipRecord
	organizations: OrganizationsRecord
	projectClients: ProjectClientsRecord
	projects: ProjectsRecord
	structures: StructuresRecord
	transitions: TransitionsRecord
	typologies: TypologiesRecord
	typologyFeatures: TypologyFeaturesRecord
	unitFeatures: UnitFeaturesRecord
	units: UnitsRecord
	users: UsersRecord
}

export type CollectionResponses = {
	_authOrigins: AuthoriginsResponse
	_externalAuths: ExternalauthsResponse
	_mfas: MfasResponse
	_otps: OtpsResponse
	_superusers: SuperusersResponse
	amenities: AmenitiesResponse
	availabilities: AvailabilitiesResponse
	clients: ClientsResponse
	features: FeaturesResponse
	organizationMembership: OrganizationMembershipResponse
	organizations: OrganizationsResponse
	projectClients: ProjectClientsResponse
	projects: ProjectsResponse
	structures: StructuresResponse
	transitions: TransitionsResponse
	typologies: TypologiesResponse
	typologyFeatures: TypologyFeaturesResponse
	unitFeatures: UnitFeaturesResponse
	units: UnitsResponse
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
	collection(idOrName: 'amenities'): RecordService<AmenitiesResponse>
	collection(idOrName: 'availabilities'): RecordService<AvailabilitiesResponse>
	collection(idOrName: 'clients'): RecordService<ClientsResponse>
	collection(idOrName: 'features'): RecordService<FeaturesResponse>
	collection(idOrName: 'organizationMembership'): RecordService<OrganizationMembershipResponse>
	collection(idOrName: 'organizations'): RecordService<OrganizationsResponse>
	collection(idOrName: 'projectClients'): RecordService<ProjectClientsResponse>
	collection(idOrName: 'projects'): RecordService<ProjectsResponse>
	collection(idOrName: 'structures'): RecordService<StructuresResponse>
	collection(idOrName: 'transitions'): RecordService<TransitionsResponse>
	collection(idOrName: 'typologies'): RecordService<TypologiesResponse>
	collection(idOrName: 'typologyFeatures'): RecordService<TypologyFeaturesResponse>
	collection(idOrName: 'unitFeatures'): RecordService<UnitFeaturesResponse>
	collection(idOrName: 'units'): RecordService<UnitsResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
