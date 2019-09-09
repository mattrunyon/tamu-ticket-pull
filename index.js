var gameCosts = {
	'Texas State': 50,
	'Lamar': 50,
	'Auburn': 100,
	'Alabama (Likely no additional guest tickets. Only conversions)': 125,
	'Mississippi State': 80,
	'UTSA': 50,
	'South Carolina': 80
}

$(document).ready(function() {
	Object.keys(gameCosts).forEach(function(key) {
		var option = document.createElement('option');
		option.value = key;
		option.textContent = key;
		document.getElementById('gameSelect').appendChild(option);
	});
	$('#gameSelect').material_select();
});

function getTicketCount() {
	return parseInt(ticketCount.value);
}

function getTotalPasses() {
	return parseInt(u4passes.value) + parseInt(u3passes.value) + parseInt(u2passes.value) + parseInt(u1passes.value);
}

function getPullDay() {
	var passesRequired = Math.ceil(getTicketCount() / 2);
	var passCount = parseInt(u4passes.value);

	if (passCount >= passesRequired) {
		return 'Monday';
	} else {
		passCount += parseInt(u3passes.value);
	}

	if (passCount >= passesRequired) {
		return 'Tuesday';
	} else {
		passCount += parseInt(u2passes.value);
	}

	if (passCount >= passesRequired) {
		return 'Wednesday';
	} else {
		passCount += parseInt(u1passes.value);
	}

	if (passCount >= passesRequired) {
		return 'Thursday';
	} else {
		return false;
	}
}

// Number of guest tickets purchased at full price.
function getGuestTickets() {
	var count = getTicketCount() - getTotalPasses();
	return count < 0 ? 0 : count;
}

// Number of tickets you just need to buy a guest label for.
function getGuestConversions() {
	var count = getTicketCount() - getGuestTickets() - parseInt(tamuStudents.value);
	return count < 0 ? 0 : count;
}

function getIDsNeeded() {
	return getTicketCount() - getGuestTickets() - getGuestConversions();
}

function getCost() {
	var game = $('#gameSelect').val();
	return (getGuestTickets() * gameCosts[game]) + (getGuestConversions() * gameCosts[game] / 2);
}

function updateResults() {
	var pullDay = getPullDay();

	if (!pullDay) { // If it's impossible to pull hide the costs section and return.
		document.getElementById('pullDay').textContent = 'Impossible without more sports passes';
		document.getElementById('costs').style.display = 'none';
		return;
	}

	document.getElementById('costs').style.display = 'block';
	if (getTicketCount() > 10) {
		document.getElementById('pullDay').textContent = 'You must pull BEFORE 5pm Tuesday in the group pull line. You will only get 3rd deck.';
	} else {
		document.getElementById('pullDay').textContent = 'You can pull on ' + pullDay;
	}

	var guestConvCount = getGuestConversions();
	var guestTicketCount = getGuestTickets();
	var cost = getCost();
	var perGuest = gameCosts[$('#gameSelect').val()];

	document.querySelectorAll('.guestConvCount').forEach(function(elem) {
		elem.textContent = guestConvCount;
	});

	document.querySelectorAll('.guestTicketCount').forEach(function(elem) {
		elem.textContent = guestTicketCount;
	});

	document.getElementById('totalCost').textContent = cost;

	document.querySelectorAll('.guestTicketCost').forEach(function(elem) {
		elem.textContent = perGuest;
	});

	document.querySelectorAll('.guestConvCost').forEach(function(elem) {
		elem.textContent = perGuest / 2;
	});

	document.getElementById('studentIdsNeeded').textContent = getIDsNeeded();
}

document.querySelectorAll('input').forEach(function(elem) {
	elem.addEventListener('change', updateResults);
	elem.addEventListener('keyup', updateResults);
});
$('#gameSelect').on('change', updateResults);
