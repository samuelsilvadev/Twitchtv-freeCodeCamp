function _chainRequestToStream(data) {
	return this.createRequestsToStream(data.name)
		.then(dataStream => ({ data, dataStream }));
}

function Twitch(clients) {
	if (!(this instanceof Twitch)) {
		return new Twitch(clients);
	}

	this.ajax = require('./ajax');
	this.API_BASE = 'https://wind-bow.glitch.me/twitch-api/';
	this.clients = clients;
}

Twitch.prototype.createRequestsToUsers = function createRequestsToUsers() {
	return this.clients.map(client => this.ajax.get(`${this.API_BASE}users/${client}`));
};

Twitch.prototype.createRequestsToStream = function createRequestsToStream(user) {
	return this.ajax.get(`${this.API_BASE}streams/${user}`);
};

Twitch.prototype.getUsers = function getUsers() {
	return Promise.all(this.createRequestsToUsers())
		.then(data => data.map(d => _chainRequestToStream.call(this, d)))
		.catch((err) => {
			console.error(err);
		});
};

Twitch.prototype.createBoxHTMLTwitch = function createBoxHTMLTwitch({ data, dataStream }) {
	const { stream } = dataStream;
	return `
	<div class="boxes-twitch__box ${ dataStream.stream ? 'boxes-twitch__box--online' : 'boxes-twitch__box--offline'}">
		<a href="https://www.twitch.tv/${data.name}" target="_blank">	
			<img class="boxes-twitch__box__image" src="${data.logo || 'http://via.placeholder.com/150x150'}" alt="150X150">
		</a>
		<h4 class="boxes-twitch__box__title">${data.display_name}</h4>
		<p title="">
			${stream ? stream.channel.status.substring(0, 20) : ''}
		</p>
	</div>`;
};

module.exports = Twitch;
