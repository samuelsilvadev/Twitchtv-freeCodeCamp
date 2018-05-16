'use strint';

(function init(window, document) {
	const $boxTwitchs = document.querySelector('[data-js="boxes-twitch"]');
	const Twitch = require('./twitch');

	function startTwitch() {
		const t = Twitch([
			'ESL_SC2',
			'OgamingSC2',
			'cretetion',
			'freecodecamp',
			'storbeck',
			'habathcx',
			'RobotCaleb',
			'noobs2ninjas',
		]);

		t.getUsers()
			.then((stream) => {
				return Promise.all(stream);
			})
			.then((result) => {
				$boxTwitchs.innerHTML = result.map(r => t.createBoxHTMLTwitch(r)).join('');
			});
	}

	window.addEventListener('load', startTwitch);

}(window, document));
