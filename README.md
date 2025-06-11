# Overview
 This library offers a collection of data serializers for various projects.
 It's designed to be use in conjunction with the [@ehubbell/adapters](https://github.com/ehubbell/adapters) library though it also works well on it's own.
 Each serializer offers a simple interface for serializing and normalizing data arrays and objects according to your specification.
 By abstracting this logic into a package, we're able to reduce and consolidate the boilerplate code necessary for each project.

## Installation
```
npm install @ehubbell/adapters
```

## Usage
```tsx
import React from 'react';

import { BaseAdapter } from '@ehubbell/adapters';
import {
	jsonApiNormalize,
	jsonApiNormalizeArray,
	jsonApiSerialize,
	jsonApiSerializeArray,
} from '@ehubbell/serializers';

const StoreContext = React.createContext(null);

const StoreProvider = ({ children }) => {
	// Computed
	const client = new BaseAdapter({ domain: process.env.NEXT_PUBLIC_API_DOMAIN });

	// Methods
	const query = async ({ method = 'GET', url, headers, params }) => {
		const response = await client.storeRequest({ method, url, headers, params });
		return jsonApiNormalizeArray(response.data, response.included, response.meta);
	};

	const queryRecord = async ({ method = 'GET', url, headers, params }) => {
		const response = await client.storeRequest({ method, url, headers, params });
		return jsonApiNormalize(response.data, response.included);
	};

	const saveRecord = async ({ url, headers, params, data }) => {
		return data.id
			? await updateRecord({ method: 'PUT', url, headers, params, data })
			: await createRecord({ method: 'POST', url, headers, params, data });
	};

	const createRecord = async ({ method = 'POST', url, headers, params, data }) => {
		const formattedData = isArray(data) ? jsonApiSerializeArray(data) : jsonApiSerialize(data);
		const response = await client.storeRequest({ method, url, headers, params, data: formattedData });
		return jsonApiNormalize(response.data, response.included);
	};

	const updateRecord = async ({ method = 'PUT', url, headers, params, data }) => {
		const formattedData = isArray(data) ? jsonApiSerializeArray(data) : jsonApiSerialize(data);
		const response = await client.storeRequest({ method, url, headers, params, data: formattedData });
		return jsonApiNormalize(response.data, response.included);
	};

	const deleteRecord = async ({ method = 'DELETE', url, headers, params, data }) => {
		const formattedData = isArray(data) ? jsonApiSerializeArray(data) : jsonApiSerialize(data);
		const response = await client.storeRequest({ method, url, headers, params, data: formattedData });
		return jsonApiNormalize(response.data, response.included);
	};

	const request = async ({ method = 'GET', url, headers, params, data }) => {
		return await client.apiRequest({ method, url, headers, params, data });
	};

	// Render
	return (
		<StoreContext.Provider
			value={{ query, queryRecord, saveRecord, createRecord, updateRecord, deleteRecord, request }}>
			{children}
		</StoreContext.Provider>
	);
};

const useStore = () => {
	return React.useContext(StoreContext);
};

export { StoreProvider, useStore };

```

## Development
This project uses [yalc](https://npmjs.com/package/yalc) for local development.
- npm run dev
- switch to project
- npx yalc add @ehubbell/serializers
- After that, this library should hot reload into the consuming application

## Scripts
- We've included a couple of helpful scripts for faster development.
- deploy: `npm run deploy -- 'commit message'`
- publish: `npm run publish -- 'commit message' [major|minor|patch]`

## Husky
- Husky configuration is setup to lint and format the repo on every commit
- Edit the `.husky/pre-commit` file to change your settings

## Author
- [Eric Hubbell](http://www.erichubbell.com)
- eric@erichubbell.com

## Notes
To see this library in action, checkout the following projects:
- [playbooks](https://www.playbooks.xyz)
- [playbooks blog](https://blog.playbooks.xyz)
- [playbooks docs](https://docs.playbooks.xyz)
