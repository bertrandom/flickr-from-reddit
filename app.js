var http = require('http');

var getShortUrlCode = function(num) {
	if (typeof num!=='number') num = parseInt(num);
	var enc='';
	var alpha='123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
	var div=num;
	while(num>=58){
		div=num/58;
		var mod=(num-(58*Math.floor(div)));
		enc=''+alpha.substr(mod,1)+enc;
		num=Math.floor(div);
	} 
	return(div)?''+alpha.substr(div,1)+enc:enc;
};

var subreddits = ['machineporn', 'EarthPorn', 'AbandonedPorn', 'CityPorn', 'VillagePorn', 'ArchitecturePorn', 'AgriculturePorn', 'CabinPorn', 'HumanPorn', 'AnimalPorn', 'ITookAPicture', 'EyeCandy'];
var subredditsComplete = 0;

var photos = [{
	owner: 'bertrandom',
	id: 10704633494
}];

subreddits.forEach(function(subreddit) {

	http.get("http://www.reddit.com/r/" + subreddit + "/new.json?sort=hot", function(res) {

		var data = {
			responseText: ''
		};

		res.on('data', function(chunk) {
			data.responseText += chunk;
		});

		res.on('end', function() {
			var result = JSON.parse(data.responseText);

			result.data.children.forEach(function(child) {

				var matches = child.data.url.match(/^http:\/\/www.flickr.com\/photos\/(([0-9]+@N[0-9]+)|([0-9a-zA-Z-_]+))\/([0-9]+)\//);
				if (matches) {

					photos.push({
						owner: matches[1],
						id: matches[4]
					})

				}

				matches = child.data.url.match(/^http:\/\/farm[0-9]+.staticflickr.com\/[0-9]+\/([0-9]+)_/);
				if (matches) {

					photos.push({
						id: matches[1]
					});

				}

			});

			subredditsComplete++;

			if (subredditsComplete === subreddits.length) {

				var first_photo = photos[0];

				var url = 'http://www.flickr.com/photos/' + first_photo.owner + '/' + first_photo.id + '/in/photolist';

				for (var index in photos) {

					photo = photos[index];
					url += '-' + getShortUrlCode(photo.id);

				}

				console.log(url);

			}

		});

	});

});