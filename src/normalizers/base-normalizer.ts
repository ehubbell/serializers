import { isArray, isObject } from 'utils/helpers';
import { dashToCamel, dashToUnderscore } from 'utils/transforms';

// Helpers
const formatLookup = type => {
	switch (type) {
		case 'camel':
			return dashToCamel;
		case 'underscore':
			return dashToUnderscore;
	}
};

// normalize
export const normalizeArray = (type = 'camel', data = [], included = [], meta = {}) => {
	const normalizedArray = { data: [], meta: {} };
	data.map(v => normalizedArray.data.push(normalizeAttrs(type, v, included)));
	normalizedArray.meta = normalizeMeta(meta);
	return normalizedArray;
};

export const normalize = (type = 'camel', data, attrs = []) => {
	const normalizedData = { data: {} };
	Object.assign(normalizedData.data, normalizeAttrs(type, data, attrs));
	// log('normalizedData: ', normalizedData);
	return normalizedData;
};

export const normalizeAttrs = (type, data, attrs = []) => {
	const formatter = formatLookup(type);
	const normalizedAttrs = {};
	Object.keys(data).map(key => {
		if (attrs.includes(key)) return;
		if (isArray(data[key])) {
			return (normalizedAttrs[formatter(key)] = data[key].map(v => normalizeAttrs(v, attrs)));
		}
		if (isObject(data[key])) {
			return (normalizedAttrs[formatter(key)] = normalizeAttrs(data[key], attrs));
		}
		return (normalizedAttrs[formatter(key)] = data[key]);
	});
	return normalizedAttrs;
};

export const normalizeMeta = meta => {
	const formatter = formatLookup('camel');
	const normalizedMeta = {};
	Object.keys(meta).map(key => (normalizedMeta[formatter(key)] = parseInt(meta[key])));
	return normalizedMeta;
};

// Docs
//
