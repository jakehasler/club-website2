'use strict';
const koa = require('koa');
const app = koa();
const Router = require('koa-router');
const serve = require('koa-static');
const fs = require('co-fs');
const path = require('path');
const gzip = require('koa-gzip');
const bodyParser = require('koa-bodyparser');




const router = new Router();

// gzip all the things!
app.use(gzip());
app.use(bodyParser());


// defines static directory, available for html to query assets
app.use(serve('public'));

// home view
function * home(next) {
	let htmlFile;
	try {
		htmlFile = yield fs.readFile('views/index.html');
	}
	catch (e) {
		return yield internalError;
	}
	this.body = htmlFile;
	this.status = 200;
	this.type = 'text/html';
}

// events admin view
function * eventsAdmin(next) {
	let htmlFile;
	try {
		htmlFile = yield fs.readFile('views/events-admin.html');
	}
	catch (e) {
		return yield internalError;
	}
	this.body = htmlFile;
	this.status = 200;
	this.type = 'text/html';
}


// get events json
function * getEvents(next) {
	let jsonFile;
	try {
		jsonFile = yield fs.readFile('json/events.json');
	}
	catch (e) {
		return yield notFoundError;
	}
	this.body = jsonFile;
	this.status = 200;
	this.type = 'application/json';
}

// post events json
function * postEvents(next) {
	const jsonPath = path.join(__dirname, '..', 'json', 'events.json');
	const jsonData = this.request.body;
	if (!Array.isArray(jsonData)) {
		this.status = 403;
		return;
	}

	try {
		yield fs.writeFile('json/events.json', JSON.stringify(jsonData));
	}
	catch (e) {
		this.status = 500;
		return;
	}

	this.status = 200;
}

// 500 error view
function * internalError() {
	this.status = 500;
	this.type = 'text/html';
	const css = '<style type="text/css">	 html, body { margin:0; padding:0; font-family: \'menlo\', \'helvetica neue\'; } * { text-align: center; } </style>';
	const html = '<!doctype html><html><head><title>Internal Error</title> ' + css + ' </head><body><h1>Houston, we have a problem.</h1><p>Internal Error</p></body></html>';
	this.body = html;
}

// 404 error view
function * notFoundError() {
	this.status = 404;
	this.type = 'text/html';
	const css = '<style type="text/css">	 html, body { margin:0; padding:0; font-family: \'menlo\', \'helvetica neue\'; } * { text-align: center; } </style>';
	const html = '<!doctype html><html><head><title>Not Found</title> ' + css + ' </head><body><h1>Houston, we have a problem.</h1><p>404 Not Found</p></body></html>';
	this.body = html;
}

// 403 error view
function * forbiddenError() {
	this.status = 403;
	this.type = 'text/html';
	const css = '<style type="text/css">	 html, body { margin:0; padding:0; font-family: \'menlo\', \'helvetica neue\'; } * { text-align: center; } </style>';
	const html = '<!doctype html><html><head><title>Forbidden</title> ' + css + ' </head><body><h1>You\'re not as important as you thought.</h1><p>Forbidden</p></body></html>';
	this.body = html;
}


router.get('/', home);
router.get('/events-admin', eventsAdmin);
router.get('/get/events', getEvents);
router.post('/post/events', postEvents);

// implement the routes
app.use(router.middleware());

// fallback 404 error
app.use(notFoundError);

app.listen(3000);

console.log('running on port 3000');
