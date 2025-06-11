import { isArray, isObject } from 'utils/helpers';
import { dashToCamel } from 'utils/transforms';

// Helpers
const attrs = {
	type: { normalize: false, serialize: false },
	updatedAt: { serialize: false },
	createdAt: { serialize: false },
};

const relationships = {};

// Methods
const checkAttrs = key => {
	const keys = Object.keys(attrs);
	return keys.includes(key) ? attrs[key] : {};
};

const checkRelationships = key => {
	const keys = Object.keys(relationships);
	return keys.includes(key) ? relationships[key] : {};
};

// normalize
export const jsonApiNormalizeArray = (data = [], included = [], meta = {}) => {
	const normalizedArray = { data: [], meta: {} };
	data.map(v => normalizedArray.data.push(jsonApiNormalizeAttrs(v, included)));
	normalizedArray.meta = jsonApiNormalizeMeta(meta);
	return normalizedArray;
};

export const jsonApiNormalize = (data = {}, included = []) => {
	const normalizedData = { data: {} };
	normalizedData.data = jsonApiNormalizeAttrs(data, included);
	return normalizedData;
};

export const jsonApiNormalizeAttrs = (data = {}, included = []) => {
	const normalizedAttrs = {};
	Object.keys(data).map(key => {
		if (checkAttrs(key).normalize === false) return;
		switch (key) {
			case 'attributes':
				return Object.assign(normalizedAttrs, jsonApiNormalizeAttrs(data[key], included));

			case 'relationships':
				return Object.assign(normalizedAttrs, jsonApiNormalizeRelationships(data[key], included));

			default:
				return (normalizedAttrs[dashToCamel(key)] = data[key]);
		}
	});
	return normalizedAttrs;
};

export const jsonApiNormalizeRelationships = (data = [], included) => {
	const normalizedAttrs = {};

	Object.keys(data).map(key => {
		const relationship = data[key].data;

		if (isArray(relationship)) {
			return (normalizedAttrs[dashToCamel(key)] = relationship.map(v => jsonApiNormalizeRelationship(v, included)));
		}
		if (isObject(relationship)) {
			return (normalizedAttrs[dashToCamel(key)] = jsonApiNormalizeRelationship(relationship, included));
		}
	});
	return normalizedAttrs;
};

export const jsonApiNormalizeRelationship = (data, included = []) => {
	const relationship = included.find(v => v.type === data.type && v.id === data.id);
	return jsonApiNormalizeAttrs(relationship);
};

export const jsonApiNormalizeMeta = (meta = {}) => {
	const normalizedMeta = {};
	Object.keys(meta).map(key => (normalizedMeta[dashToCamel(key)] = parseInt(meta[key])));
	return normalizedMeta;
};

// Docs
// https://jsonapi-resources.com/
