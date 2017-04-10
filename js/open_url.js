var default_url = "https://dinbendon.net/do/";

document.addEventListener("DOMContentLoaded", function() {
    var open_url = document.getElementById("open_url");
    // onClick"s logic below:
    open_url.addEventListener("click", function() {
		let dinbendon_url;
		chrome.storage.sync.get(
			"dinbendon_url", 
			function(items) {
				let time_format;
				if (items.dinbendon_url == undefined) {
					dinbendon_url = default_url;
				}
				else {
					dinbendon_url = items.dinbendon_url;
				}
				chrome.tabs.create({url: dinbendon_url});
			}
		);
		
    });
});

