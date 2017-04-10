var default_url = "https://dinbendon.net/do/";


function setAlarm() {
	chrome.runtime.sendMessage(setURL(), function(response) {
			console.log(response);
	});
}

function setURL() {
	let dinbendon_url = document.getElementById("dinbendon_url").value;
	chrome.storage.sync.set({
			"dinbendon_url": dinbendon_url
		}, 
		function() {
			console.log("URL settings saved");
		}
	);
	
	let send_message = {
		"Status": "Set_URL",
		"Value": {
			"dinbendon_url": dinbendon_url
		}
	}
	return send_message
}

function getURL() {
	let url;
	chrome.storage.sync.get(
		"dinbendon_url", 
		function(items) {
			let time_format;
			if (items.dinbendon_url == undefined) {
				url = default_url;
			}
			else {
				url = items.dinbendon_url;
			}
			document.getElementById("dinbendon_url").value = url;
		}
	);
}

function init() {
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




