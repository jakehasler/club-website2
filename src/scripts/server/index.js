'use strict';
const koa = require('koa');
const app = koa();
const Router = require('koa-router');
// const serve = require('koa-static');
const fs = require('co-fs');
const path = require('path');

const router = new Router();

// app.use(serve(path.join(__dirname, 'public')));

function * home(next) {
	let html;
	try {
		html = yield fs.readFile('views/index.html');
	}
	catch (e) {
		return yield internalError;
	}
	this.body = fileContents;
	this.status = 200;
	this.type = 'text/html';
}

function * eventsAdmin(next) {
	// console.log(this.request.query);
	// this.type = 'json';
	// this.status = 200;
	// this.body = {
	// 	username: 'same'
	// };
}

function * internalError() {
	this.status = 500;
	this.type = 'text/html';
	let css = '<style type="text/css">	 html, body { margin:0; padding:0; font-family: \'menlo\', \'helvetica neue\'; } * { text-align: center; } </style>';
	let html = '<!doctype html><html><head><title>Internal Error</title> ' + css + ' </head><body><h1>Houston, we have a problem.</h1><p>Internal Error</p></body></html>';
	this.body = html;
}

function * notFoundError() {
	this.status = 404;
	this.type = 'text/html';
	let css = '<style type="text/css">	 html, body { margin:0; padding:0; font-family: \'menlo\', \'helvetica neue\'; } * { text-align: center; } </style>';
	let html = '<!doctype html><html><head><title>Not Found</title> ' + css + ' </head><body><h1>Houston, we have a problem.</h1><p>404 Not Found</p></body></html>';
	this.body = html;
}

function * forbiddenError() {
	this.status = 403;
	this.type = 'text/html';
	let css = '<style type="text/css">	 html, body { margin:0; padding:0; font-family: \'menlo\', \'helvetica neue\'; } * { text-align: center; } </style>';
	let html = '<!doctype html><html><head><title>Forbidden</title> ' + css + ' </head><body><h1>You\'re not as important as you thought.</h1><p>Forbidden</p></body></html>';
	this.body = html;
}

router.get('/', home);
router.get('/events-admin', eventsAdmin);

// implement the routes
app.use(router.middleware());

// fallback 404 error
app.use(notFoundError);

app.listen(3000);

console.log('running on port 3000');
