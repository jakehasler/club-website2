# website

### It would be wise to install required global and local modules:
```
npm i -g stylus babel uglify-js eslint nodemon && npm i
```

### To run locally:

- run it: `nodemon`

### To compile stylus form `src` to `public`:
- `npm run stylus`

### To build javascript from `src` to `public`:
- `npm run build`
Javascript will be linted before being built. 

To just lint your code without building:
- `npm run lint`
