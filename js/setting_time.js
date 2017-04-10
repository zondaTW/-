
function setAlarm() {
	chrome.runtime.sendMessage(setTime(), function(response) {
			console.log(response);
	});
}

function setTime() {
	let dinbendon_time = document.getElementById("dinbendon_time").value.split(":");
	let dessert_time = document.getElementById("dessert_time").value.split(":");
	chrome.storage.sync.set({
		"dinbendon_time": {"hours" : dinbendon_time[0], 
						   "minute": dinbendon_time[1]},
		"dessert_time":   {"hours" : dessert_time[0], 
						   "minute": dessert_time[1]}
		}, 
		function() {
			console.log("Time settings saved");
		}
	);
	
	let send_message = {
		"Status": "Set_Time",
		"Value": {
			'dinbendon_time': dinbendon_time,
			'dessert_time': dessert_time
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

function init() {
	getTime();
}

window.addEventListener("load", init);

document.addEventListener("DOMContentLoaded", function() {
    var save = document.getElementById("save");
    // onClick"s logic below:
    save.addEventListener("click", function() {
		setAlarm();
    });
});




