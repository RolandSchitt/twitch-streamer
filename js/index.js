$(document).ready(function() {
	
	const streamers = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas", "eleaguetv"];
	
	var userInfo = [];
	var buttonsClass = document.getElementsByClassName('statusBtn');
	var table = document.getElementById('resultsTable');
	
	//function for twitch api calls
	function getInfo (toSearch) {
		
		function jsonFunction (userNames) {
			var url = "https://wind-bow.glitch.me/twitch-api/streams/" + userNames;
			
			$.getJSON(url, function(data) {
				//if the user is offline
				if(data.stream === null) {
						//new .getjson call to get icon from other address/json
						$.getJSON("https://wind-bow.glitch.me/twitch-api/users/"+userNames, function(data) {
							userInfo.push(data);
							var image1 = '<img src="'+data.logo+'" class="img-circle" alt="'+userNames+'">';
							table.insertAdjacentHTML('beforeend', '<tr><td>'+image1+'</td><td><a href="https://www.twitch.tv/'+
															userNames+'">'+data.display_name+
														 '</a></td><td class="tableStatus">OFFLINE</td></tr>');
						
						});
				}

				//if user is online
				else{
					userInfo.push(data);
					var image2 = '<img src="'+data.stream.channel.logo+
						 '" class="img-circle" alt="'+userNames+'">';
					table.insertAdjacentHTML('beforeend', '<tr><td>'+image2+
													 '</td><td><a href="'+data.stream.channel.url+
													 '">'+data.stream.channel.display_name+
													 '</a></td><td class="tableStatus">'+data.stream.game+
													 '</td></tr>');
				}
			});
		}
		
		for (var k = 0; k < toSearch.length; k++) {
			var userName = toSearch[k];
			jsonFunction (userName);
		}
	}
	//function to decide which button was pressed, then update table accordingly
	function updateTable () {
		table.innerHTML = "";
		var btnID = this.id;
		
		//loop through each user checking if they are 'online', the update table with them
		if (btnID === "onlineBtn") {
			for (var i = 0; i < userInfo.length; i++) {
				if (userInfo[i].stream !== undefined) {
				   var image2 = '<img src="'+userInfo[i].stream.channel.logo+
						 '" class="img-circle" alt="'+userInfo[i].stream.channel.display_name+'">';
					table.insertAdjacentHTML('beforeend', '<tr><td>'+image2+
						'</td><td><a href="'+userInfo[i].stream.channel.url+'">'+userInfo[i].stream.channel.display_name+
						'</a></td><td class="tableStatus">'+userInfo[i].stream.game+'</td></tr>');	
				}
			}
		}
		
		//loop through each user checking if offline, then update table with only offline users
		else if (btnID === "offlineBtn") {
			for (var i = 0; i < userInfo.length; i++) { 
				if (userInfo[i].bio !== undefined) {
					var image1 = '<img src="'+userInfo[i].logo+'" class="img-circle" alt="'+userInfo[i].display_name+'">';
					table.insertAdjacentHTML('beforeend', '<tr><td>'+image1+'</td><td><a href="'+userInfo[i]._links.self+'">'+userInfo[i].display_name+'</a></td><td class="tableStatus">OFFLINE</td></tr>');
				}
			}
		}
		
		else if (btnID === 'allBtn') {
			userInfo = [];
			getInfo(streamers);
		}
	}
	//TODO write function for json call from search box
	function searchUser() {
		var searchBox = [];
		searchBox.push(document.getElementById('searchBox').value);
		/*if (value === '') {
			alert('Please Enter a Valid UserName');
		}*/
	   table.innerHTML = "";
		getInfo(searchBox);	
	}
	
	getInfo(streamers);
	console.log(userInfo);
	//add listener to all three selection buttons then update
	//table based on which button
	for (var i = 0; i < buttonsClass.length; i++) {
       buttonsClass[i].addEventListener('click', updateTable);
	}
	
	//search box and button
	var searchBtn = document.getElementById('searchBtn');
	searchBtn.addEventListener('click', searchUser);

	// submit form with Enter key
	document.getElementById('searchBox').addEventListener('keypress', function(event) {
		// Number 13 is the "Enter" key on the keyboard
		if (event.keyCode === 13) {
			// Trigger the button element with a click
			document.getElementById('searchBtn').click();
		}
	});
		
	//prevent form submission from reloading page
	$('#searchForm').submit(function(e) {
		e.preventDefault();
	});
	
});