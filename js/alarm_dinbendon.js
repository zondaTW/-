var whenToRing = {
	"dinbendon_time": new Date().setHours(10, 10, 00),
	"dinner_time": new Date().setHours(12, 00, 00),
	"dessert_time": new Date().setHours(15, 10, 00)
};
var dinbendon_url = "https://dinbendon.net/do/";
var dinbendon_icon = "../icon/menu.png";
var dinner_icon = "../icon/rice.png"
var dessert_icon = "../icon/creme-caramel.png";

function create_alarm() {
	chrome.alarms.clearAll();
	
	let now_time = new Date().getTime();
	if (now_time <= whenToRing.dinbendon_time) {
		chrome.alarms.create(
			"DinBenDonAlarm", 
			{when: whenToRing.dinbendon_time}
		);
		console.log("DinBenDonAlarm Create~~~");
	}
	else if (now_time < whenToRing.dinner_time){
		chrome.alarms.create(
			"DinnerAlarm", 
			{when: whenToRing.dinner_time}
		);
		console.log("DinnerAlarm Create~~~");
	}
	else if (now_time < whenToRing.dessert_time) {
		chrome.alarms.create(
			"DessertAlarm", 
			{when: whenToRing.dessert_time}
		);
		console.log("DessertAlarm Create~~~");
	}
}

function sleep(milliseconds) {
  let start = new Date().getTime();
  for (let i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
}

function setAlarmTime(time_info) {
	let time_format;
	chrome.storage.sync.get(
		time_info.name, 
		function(items) {
			let time_format;
			try {
				time_format = new Date().setHours(
					items[time_info.name]["hours"],
					items[time_info.name]["minute"], 00);
				
			}
			catch (err) {
				time_format = time_info.default_time;
			}
			whenToRing[time_info.name] = time_format;
			create_alarm();
		}
	);
}

function getTime() {
	let time_infos = [
		{
			"name": "dinbendon_time",
			"default_time": new Date().setHours(10, 10, 00)
		},
		{
			"name": "dinner_time",
			"default_time": new Date().setHours(12, 00, 00)
		},
		{
			"name": "dessert_time",
			"default_time": new Date().setHours(15, 10, 00)
		}
	]
	time_infos.forEach(setAlarmTime);
}


function getURL() {
	let url;
	chrome.storage.sync.get(
		"dinbendon_url", 
		function(items) {
			let time_format;
			if (items.dinbendon_url != undefined) {
				dinbendon_url = items.dinbendon_url;
			}
			
		}
	);
}

function init() {
	getURL();
	chrome.storage.sync.get(
		"dinbendon_time", 
		function(items) {
			try {
				items["dinbendon_time"]["hours"];
				getTime();
			}
			catch(err) {
				console.log("First use~~");
				create_alarm();
			}
		}
	)
}

function timstampTotime(timestamp) {
	date = new Date(timestamp);
	datevalues = [
	   date.getFullYear(),
	   date.getMonth()+1,
	   date.getDate(),
	   date.getHours(),
	   date.getMinutes(),
	   date.getSeconds(),
	];
	return datevalues
}

function main() {
	console.log("Time to DinBenDon start");
	init();
}


chrome.alarms.onAlarm.addListener(function(alarm) {
	let notify;
	if (alarm.name == "DinBenDonAlarm") {
		notify = new Notification("甲奔皇帝大", {
			body: "DinBenDon瞜~~~~~",
			icon: dinbendon_icon
		});

		notify.onclick = function() {
			chrome.tabs.create({url: dinbendon_url});
		}
	}
	else if (alarm.name == "DinnerAlarm") {
		notify = new Notification("甲奔皇帝大", {
			body: "領便當瞜~~~~~",
			icon: dinner_icon
		});
	}
	else if (alarm.name == "DessertAlarm") {
		notify = new Notification("甲奔皇帝大", {
			body: "拿點心瞜~~~~~",
			icon: dessert_icon
		});
	}
	sleep(1000);
	create_alarm();
});


chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.Status === "Set") {
			whenToRing.dinbendon_time = new Date()
				.setHours(
					request.Value.dinbendon_time[0], 
					request.Value.dinbendon_time[1], 0);
			whenToRing.dinner_time = new Date()
				.setHours(
					request.Value.dinner_time[0], 
					request.Value.dinner_time[1], 0);
			whenToRing.dessert_time = new Date()
				.setHours(
					request.Value.dessert_time[0], 
					request.Value.dessert_time[1], 0);
			dinbendon_url = request.Value.dinbendon_url;
			create_alarm();
			sendResponse('sendMessage success!');
		}
});

main();