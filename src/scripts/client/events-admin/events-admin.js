const _ = {
	isArray: obj => typeof obj === 'object' && (Array.isArray && Array.isArray(obj) || obj.constructor === Array || obj instanceof Array),

	// loop array
	each(list, func) {
		if (!list || !list.length)
			return null;
		for (let i = 0, ii = list.length; i < ii; i++)
			func(list[i], i);
	},

	// map array
	map(list, func) {
		if (!list || !list.length)
			return [];
		const arr = [];
		for (let i = 0, ii = list.length; i < ii; i++)
			arr.push(func(list[i]));
		return arr;
	},

	// filter array
	filter(list, func) {
		if (!list || !list.length)
			return [];
		const arr = [];
		for (let i = 0, ii = list.length; i < ii; i++) {
			if (func(list[i]))
				arr.push(list[i]);
		}
		return arr;
	},

	// merge objects
	merge(...args) {
		const obj = {};
		_.each(args, arg => {
			if (!arg || typeof arg !== 'object') return;
			
			_.each(Object.keys(arg), key => {
				obj[key] = arg[key];
			});
		});
		return obj;
	},

	toArray(list, ...args) {
		if (args && args.length) {
			let arr = [];
			arr = arr.concat(list);
			this.each(args, arg => {
				arr = arr.concat(arg);
			});
			return arr;
		}
		else if (!list || !list.length)
			return [list];
		else if (this.isArray(list))
			return list;
		const arr = [];
		for (let i = 0, ii = list.length; i < ii; i++)
			arr.push(list[i]);
		return arr;
	}
};

function renderEventsTable() {
	knucklebone.getJson('/get/events')
	.success(function(eventsJson) {
		console.log('json res:', eventsJson);
		dom('events-table-cont').purge();
		const frag = document.createDocumentFragment();
		_.each(eventsJson, function(evt) {
			frag.appendChild(createTableItem(evt));
		});
		dom('events-table-cont').append(frag);
	})
	.error(function() {
		dom('events-table-cont').purge().append(
			createTableItem({
				name: 'BYU Hack Night',
				place: '484 Tanner Building',
				time: 'Thursdays 7-10pm',
				description: 'Hack with others'
			})
		);
	});
}

function createTableItem(event) {
	event.date = event.date.replace(/-/g, '/');
	const tableCont = dom.create('div').addClass('table-cont');
	const weekday = getDay(event.date);
	const day = (new Date(event.date)).getDate();
	const month = getMonth(event.date);

	event.date = event.date || '';
	event.time = event.time || '';

	const tableItem = dom.create('table').addClass('event-table').append(
		dom.create('tr').addClass('event-info').append(
			dom.create('td').addClass('event-name').text(event.name),
			dom.create('td').addClass('event-place').text(event.place),
			dom.create('td').addClass('event-time').text(
				weekday + ', ' + month + ' '  + day + '. ' + event.time
			)
		),
		dom.create('tr').addClass('event-description').append(
			dom.create('td').addClass('event-description')
				.attr('colspan', 3).text(event.description)
		)
	);

	tableCont.append(
		dom.create('div').addClass('delete-event').text('x')
			.attr('data-id', event.id).listen('click', function() {
				if (typeof deleteEvent === 'function')
					deleteEvent(this.dataset.id);
			})
	);

	return tableCont.append(tableItem);
}

function getDay(date) {
	const day = (new Date(date)).getDay();
	const map = {
		0: 'Sun',
		1: 'Mon',
		2: 'Tue',
		3: 'Wed',
		4: 'Thur',
		5: 'Fri',
		6: 'Sat'
	};
	return map[day];
}

function getMonth(date) {
	const month = (new Date(date)).getMonth();
	const map = {
		0: 'Jan',
		1: 'Feb',
		2: 'Mar',
		3: 'Apr',
		4: 'May',
		5: 'Jun',
		6: 'Jul',
		7: 'Aug',
		8: 'Sep',
		9: 'Oct',
		10: 'Nov',
		11: 'Dec'
	};
	return map[month];
}

const newEventForm = dom('new-event-form');
const inputFields = dom.queryByClass('input-field').toArr();

newEventForm.listen('submit', function(evt) {
	evt.preventDefault();
	let error = false;

	const dateFormat = 'mm/dd/yyyy';

	_.each(inputFields, function(field) {
		if (field.value.trim().length <= 0) {
			field.classList.add('error');
			error = true;
		}

		if (field.getAttribute('name') === 'date') {
			const dateValue = field.value;
			const dateValueArr = new Date(dateValue).toLocaleDateString().replace(/-/g, '/').split('/');
			console.log('arr', dateValueArr);
			if (dateValueArr.length < 3) {
				error = true;
				field.classList.add('error');
				alert('(checkpoint 1) date format is: ' + dateFormat);
				return;
			}

			console.log('dateValueArr[0]: ', dateValueArr[0]);
			console.log('dateValueArr[0].length: ', dateValueArr[0].length);

			// month
			if (dateValueArr[0].length !== 2) {
				error = true;
				field.classList.add('error');
				alert('(checkpoint 2) date format is: ' + dateFormat);
				return;
			}
			// day
			if (dateValueArr[1].length !== 2) {
				error = true;
				field.classList.add('error');
				alert('(checkpoint 3) date format is: ' + dateFormat);
				return;
			}
			// year
			if (parseInt(dateValueArr[2]).toString().length !== 4) {
				error = true;
				field.classList.add('error');
				alert('(checkpoint 4) date format is: ' + dateFormat);
				return;
			}
		}
	});



	if (!error) {
		const newEvent = createNewEvent();
		knucklebone.getJson('/get/events').success(function(eventsJson) {
			newEvent.date = newEvent.date.replace(/-/g, '/');
			eventsJson.push(newEvent);
			postEventsArray(eventsJson);
		}).error(function(e) {
			alert('Error:' + e);
		});
	}
});

// remove all error highlights on focus
_.each(inputFields, function(field) {
	field.addEventListener('focus', function() {
		this.classList.remove('error');
	});
});

// make a post request with form data
function postEventsArray(eventsJson) {
	knucklebone.postJson('/post/events', eventsJson).success(function() {
		renderEventsTable();
	}).error(function(e) {
		alert('Error:' + e);
	});
}

// get the events, remove an event by id, then re-post events
function deleteEvent(id) {
	knucklebone.getJson('/get/events').success(function(eventsJson) {
		const newArr = eventsJson.filter(function(e) {
			return e.id !== id;
		});
		postEventsArray(newArr);
	}).error(function(e) {
		alert('Error:' + e);
	});
}

// creates new event based on form fields
function createNewEvent() {
	// convert form (new-event-form) fields to object
	const obj = knucklebone.formToObject('new-event-form');
	obj.id = rand(12, 'special');
	return obj;
}

window.addEventListener('load', () => renderEventsTable());
