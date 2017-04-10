
var default_value = {
	"dinbendon_time": ["10", "10"],
	"dessert_time": ["15", "10"],
	"dinbendon_url": "https://dinbendon.net/do/"
}

function setAlarm() {
	chrome.runtime.sendMessage(setTime(), function(response) {
			console.log(response);
	});
}

function setTime() {
	let dinbendon_time = document.getElementById("dinbendon_time").value.split(":");
	let dessert_time = document.getElementById("dessert_time").value.split(":");
	let dinbendon_url = document.getElementById("dinbendon_url").value;
	
	if (dinbendon_time.length == 1 && dinbendon_time[0] == "") {
		dinbendon_time = default_value.dinbendon_time;
	}
	if (dessert_time.length == 1 && dessert_time[0] == "") {
		dessert_time = default_value.dessert_time;
	}
	if (dinbendon_url == "") {
		dinbendon_url = default_value.dinbendon_url;
	}
	
	chrome.storage.sync.set({
		"dinbendon_time": {"hours" : dinbendon_time[0], 
						   "minute": dinbendon_time[1]},
		"dessert_time":   {"hours" : dessert_time[0], 
						   "minute": dessert_time[1]},
		"dinbendon_url": dinbendon_url
		}, 
		function() {
			console.log("Time settings saved");
		}
	);
	
	let send_message = {
		"Status": "Set",
		"Value": {
			'dinbendon_time': dinbendon_time,
			'dessert_time': dessert_time,
			"dinbendon_url": dinbendon_url
		}
	}
	return send_message
}

function loadTimeToHtml(time_info) {
	let time_format;
	chrome.storage.sync.get(
		time_info.name, 
		function(items) {
			let time_format;
			try {
				time_format = items[time_info.name]["hours"] + ":" + 
							  items[time_info.name]["minute"] + ":00";
				
			}
			catch (err) {
				time_format = time_info.default_time;
			}
			document.getElementById(time_info.name).value = time_format;
		}
	);
}

function getTime() {
	let time_infos = [
		{
			"name": "dinbendon_time",
			"default_time": "10:10:00"
		},
		{
			"name": "dessert_time",
			"default_time": "15:10:00"
		}
	]
	time_infos.forEach(loadTimeToHtml);
}

function getURL() {
	let url;
	chrome.storage.sync.get(
		"dinbendon_url", 
		function(items) {
			let time_format;
			if (items.dinbendon_url == undefined) {
				url = default_value.dinbendon_url;
			}
			else {
				url = items.dinbendon_url;
			}
			document.getElementById("dinbendon_url").value = url;
		}
	);
}

function init() {
	getTime();
	getURL();
}

window.addEventListener("load", init);

document.addEventListener("DOMContentLoaded", function() {
    var save = document.getElementById("save");
    // onClick"s logic below:
    save.addEventListener("click", function() {
		setAlarm();
    });
});




