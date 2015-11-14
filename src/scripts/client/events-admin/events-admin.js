function renderEventsTable() {
	knucklebone.getJson('/get/events')
	.success(function(eventsJson) {
		dom('events-table-cont').purge();
		const frag = document.createDocumentFragment();
		eventsJson.forEach(function(evt) {
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

	inputFields.forEach(function(field) {
		if (field.value.trim().length <= 0) {
			field.classList.add('error');
			error = true;
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
inputFields.forEach(function(field) {
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
