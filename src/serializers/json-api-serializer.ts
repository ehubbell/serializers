import { isArray, isObject } from 'utils/helpers';
import { camelToDash } from 'utils/transforms';

// Helpers
const attrs = {
	type: { normalize: false, serialize: false },
	updatedAt: { serialize: false },
	createdAt: { serialize: false },
};

const relationships = {};

// Helpers
const checkAttrs = key => {
	const keys = Object.keys(attrs);
	return keys.includes(key) ? attrs[key] : {};
};

const checkRelationships = key => {
	const keys = Object.keys(relationships);
	return keys.includes(key) ? relationships[key] : {};
};

// serialize
export const jsonApiSerializeArray = (data: any[] = []) => {
	const serializedData = [];
	data.map(d => serializedData.push(jsonApiSerializeAttrs(d)));
	return { data: { attributes: serializedData } };
};

export const jsonApiSerialize = (data: any = {}) => {
	const serializedData = jsonApiSerializeAttrs(data);
	return { data: { attributes: serializedData } };
};

export const jsonApiSerializeAttrs = (data: any = {}) => {
	const serializedAttrs = {};
	Object.keys(data).map(key => {
		if (isArray(data[key]) && isObject(data[key][0])) {
			return (serializedAttrs[camelToDash(key)] = data[key].map(jsonApiSerializeAttrs));
		}
		if (isArray(data[key])) {
			return (serializedAttrs[camelToDash(key)] = data[key]);
		}
		if (isObject(data[key])) {
			return (serializedAttrs[camelToDash(key)] = jsonApiSerializeAttrs(data[key]));
		}
		return (serializedAttrs[camelToDash(key)] = data[key]);
	});
	return serializedAttrs;
};

// Docs
// https://jsonapi-resources.com/
