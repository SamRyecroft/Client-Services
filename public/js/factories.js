'use strict';

// === MEMBER FACTORY TO STORE CURRENT MEMBERS === //
loginApp.factory('memberFactory', function() {

	// Array of current member: username's, email's, password's and image's.
	var members = [
		{
			username: 'alan', 
			email: 'alan@email.com', 
			password: 'alan', 
			imgURL: 'https://pbs.twimg.com/profile_images/1687271182/IMG_0011_bigger.JPG', 
			type: 1
		},
		{
			username: 'lee', 
			email: 'lee@email.com', 
			password: 'lee', 
			imgURL: 'https://pbs.twimg.com/profile_images/1247941572/62107_443414578150_513583150_5083527_6334052_n_bigger.jpg', 
			type: 2
		},
		{
			username: 'xi', 
			email: 'xi@email.com', 
			password: 'xi', 
			imgURL: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_5_200x200.png', 
			type: 3
		},
		{
			username: 'sam', 
			email: 'sam@email.com', 
			password: 'sam', 
			imgURL: 'https://scontent-a-lhr.xx.fbcdn.net/hphotos-frc1/t1.0-9/10247444_851650048183757_1789479644600810623_n.jpg', 
			type: 1
		},
		{
			username: 'sean', 
			email: 'sean@email.com', 
			password: 'sean', 
			imgURL: 'https://pbs.twimg.com/profile_images/2961086961/7737f385ba987530bcfc5fadeb3796df.png', 
			type : 2
		},
		{
			username: 'ben', 
			email: 'ben@email.com', 
			password: 'ben', 
			imgURL:'https://pbs.twimg.com/profile_images/434672519820214272/LBqErBda.jpeg', 
			type: 3
		},
		{
			username: 'felix', 
			email: 'felix@email.com', 
			password: 'felix', 
			imgURL: 'https://pbs.twimg.com/profile_images/444221163166646272/6eXdssC2.jpeg', 
			type: 1
		},
		{
			username: 'ste', 
			email: 'ste@email.com', 
			password: 'ste', 
			imgURL: 'https://pbs.twimg.com/profile_images/268982538/designfunction_twitter_icon.gif', 
			type: 2
		},
		{
			username: 'ashley', 
			email: 'ashley@email.com', 
			password: 'ashley', 
			imgURL: 'https://pbs.twimg.com/profile_images/3535292153/63c55d8b412bdfa0c8e96eb1968c4cc4.jpeg', 
			type: 3
		},
		{
			username: 'elliot', 
			email: 'elliot@email.com', 
			password: 'elliot', 
			imgURL: 'https://pbs.twimg.com/profile_images/2961086961/7737f385ba987530bcfc5fadeb3796df.png', 
			type: 1
		},
		{
			username: 'lewis', 
			email: 'lewis@email.com', 
			password: 'lewis', 
			imgURL: 'https://lh4.googleusercontent.com/-f4UVt9c-FxY/T3is3CfYmuI/AAAAAAAAAGM/aiUnnt_fF8M/w968-h964-no/10150405668665473.jpg', 
			type: 2
		},
		{
			username: 'jordy', 
			email: 'jordy@email.com', 
			password: 'jordy', 
			imgURL: 'https://pbs.twimg.com/profile_images/378800000821089440/2a5e045a20a93c3aea6f3b1823555c60.png', 
			type: 3
		},
		{
			username: 'adam', 
			email: 'adam@email.com', 
			password: 'adam', 
			imgURL: 'https://pbs.twimg.com/profile_images/2961086961/7737f385ba987530bcfc5fadeb3796df.png', 
			type: 1
		},
		{
			username: 'bridget', 
			email: 'bridget@email.com', 
			password: 'bridget', 
			imgURL: 'https://pbs.twimg.com/profile_images/3039021143/1ece24ef3cbab117acddc555e69cfa3b.jpeg', 
			type: 2
		}
	];
	
	// === Create empty factory object to be populated with the members array's. === //
	var factory = {};
	
	// === Populate the empty factory object with the members array's using .getMembers. === //
	factory.getMembers = function(){
		return members;
	};
	
	// === The memberFactory returns the factory object, now populated with the members array. === //
	return factory;
});