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
				id: 'no_id',
				name: 'Hack Night',
				place: '484 Tanner Bldg, BYU',
				date: '',
				time: '7-10pm',
				description: 'Every Thursday, Hack on things and socialize.'
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

window.addEventListener('load', () => renderEventsTable());

// update year in footer
dom('currentYear').textContent = (new Date()).getFullYear();

