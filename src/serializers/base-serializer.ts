import { isArray, isEmpty, isObject } from 'utils/helpers';
import { camelToDash, camelToUnderscore } from 'utils/transforms';

// Helpers
const formatLookup = type => {
	switch (type) {
		case 'dash':
			return camelToDash;
		case 'underscore':
			return camelToUnderscore;
	}
};

// serialize
export const serializeArray = (type = 'dash', data = [], attrs = []) => {
	const serializedData = [];
	data.map(v => serializedData.push(serializeAttrs(type, v, attrs)));
	return serializedData;
};

export const serialize = (type = 'dash', data = {}, attrs = []) => {
	const serializedData = {};
	Object.assign(serializedData, serializeAttrs(type, data, attrs));
	return serializedData;
};

export const serializeAttrs = (type = 'dash', data = {}, attrs = []) => {
	const formatter = formatLookup(type);
	const serializedData = {};

	Object.keys(data).map(key => {
		if (attrs.length === 0) return (serializedData[formatter(key)] = data[key]);
		if (isArray(data[key]) && isObject(data[key][0])) {
			const arrayData = data[key];
			const arrayAttrs = attrs
				.filter(v => v.split('.')[0] === key)
				.map(v => {
					const paths = v.split('.');
					paths.shift();
					return paths.join('.');
				});
			const formattedAttrs = !isEmpty(arrayAttrs[0]) ? arrayAttrs : [];
			if (!attrs.includes(key) && isEmpty(arrayAttrs)) return;
			return (serializedData[formatter(key)] = arrayData.map(v => serializeAttrs(type, v, formattedAttrs)));
		}
		if (isArray(data[key])) {
			if (isEmpty(data[key])) return;
			if (!attrs.includes(key)) return;
			return (serializedData[formatter(key)] = data[key]);
		}
		if (isObject(data[key]) && data[key] !== null) {
			const objectData = data[key];
			const objectAttrs = attrs.filter(v => v.split('.')[0] === key);
			const formattedAttrs = objectAttrs
				.filter(v => v.includes('.'))
				.map(v => {
					const paths = v.split('.');
					paths.shift();
					return paths.join('.');
				});
			if (isEmpty(objectAttrs)) return;
			return (serializedData[formatter(key)] = serializeAttrs(type, objectData, formattedAttrs));
		}
		if (attrs.includes(key)) return (serializedData[formatter(key)] = data[key]);
	});

	return serializedData;
};

// Docs
//
