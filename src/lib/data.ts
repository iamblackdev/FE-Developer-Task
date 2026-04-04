import { SwapiCategory } from '@/types';

export type Column = { key: string; label: string };

export const COLUMNS: Record<SwapiCategory, Column[]> = {
	people: [
		{ key: 'name', label: 'Name' },
		{ key: 'height', label: 'Height' },
		{ key: 'mass', label: 'Mass' },
		{ key: 'birth_year', label: 'Birth Year' },
		{ key: 'gender', label: 'Gender' },
	],
	planets: [
		{ key: 'name', label: 'Name' },
		{ key: 'climate', label: 'Climate' },
		{ key: 'terrain', label: 'Terrain' },
		{ key: 'population', label: 'Population' },
		{ key: 'diameter', label: 'Diameter' },
	],
	films: [
		{ key: 'title', label: 'Title' },
		{ key: 'episode_id', label: 'Episode' },
		{ key: 'director', label: 'Director' },
		{ key: 'release_date', label: 'Release Date' },
	],
	species: [
		{ key: 'name', label: 'Name' },
		{ key: 'classification', label: 'Classification' },
		{ key: 'language', label: 'Language' },
		{ key: 'homeworld', label: 'Homeworld' },
	],
	vehicles: [
		{ key: 'name', label: 'Name' },
		{ key: 'model', label: 'Model' },
		{ key: 'manufacturer', label: 'Manufacturer' },
		{ key: 'cost_in_credits', label: 'Cost in Credits' },
		{ key: 'length', label: 'Length' },
		{ key: 'crew', label: 'Crew' },
		{ key: 'passengers', label: 'Passengers' },
		{ key: 'cargo_capacity', label: 'Cargo Capacity' },
	],
	starships: [
		{ key: 'name', label: 'Name' },
		{ key: 'model', label: 'Model' },
		{ key: 'manufacturer', label: 'Manufacturer' },
		{ key: 'cost_in_credits', label: 'Cost in Credits' },
		{ key: 'length', label: 'Length' },
		{ key: 'crew', label: 'Crew' },
		{ key: 'passengers', label: 'Passengers' },
		{ key: 'cargo_capacity', label: 'Cargo Capacity' },
	],
};
