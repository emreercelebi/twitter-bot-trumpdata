console.log("Trump data bot is starting");


var Twit = require('twit');

var config = require('./config');

var T = new Twit(config);


var weekdays = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

getTweetFreqs()
setInterval(getTweetFreqs, 1000*60*60*36);

function getTweetFreqs() {

	T.get('statuses/user_timeline', {screen_name: 'realDonaldTrump', tweet_mode: 'extended', include_rts: false, count: 50}, function(err, data, response){
		var freqs = {};
		for (let i = 0; i < data.length; i++){
			updateFrequencyTable(data[i].full_text, freqs)
		}

		var words = [];
		for (word in freqs) {
			words.push(word);
		}	

		words = words.sort(function(a, b){
			return freqs[b] - freqs[a];
		});

		tweetIt(words, freqs, data.length);

	});

}

function updateFrequencyTable(text, freqs) {
	text = text.replace(/[^0-9a-z ]/gi, '').toLowerCase().trim();
	textArray = text.split(' ');
	textArray.forEach(function(word){
		if (word.length < 4) return;

		if (freqs[word]){
			freqs[word]++;
		}
		else {
			freqs[word] = 1;
		}
	});
}

function tweetIt(words, freqs, tweetCount) {
	var wordFreqs = "";
	var date = new Date();
	var hashtag = words[0];
	var num = Math.floor(Math.random() * 11);

	for (let i = 0; i < 10; i++){
		wordFreqs += words[i] + ": " + freqs[words[i]] + "\n";
		if (num == i){
			hashtag = words[i];
		}
	}

	var tweet = {
		status:"Happy " + weekdays[date.getDay()] +  "! Here are some common words in Trump's last " + tweetCount + " tweets: \n" + wordFreqs + "Do what you will with that information. #" + hashtag 
	}
	T.post('statuses/update', tweet, function() {
		console.log("It worked!");
	});
}

