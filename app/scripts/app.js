'use strint';

(function init(window, document) {
	const $boxTwitchs = document.querySelector('[data-js="boxes-twitch"]');
	const $btnsStatesChannels = document.querySelectorAll('[data-js="twitch-btn-state"]');
	let $lastBtnCLicked = $btnsStatesChannels[0];
	const Twitch = require('./twitch');

	function initEvents() {
		const elements = Array.from($btnsStatesChannels);
		elements.forEach((el) => {
			el.addEventListener('click', function addClassBtnState() {
				if ($lastBtnCLicked) {
					$lastBtnCLicked.classList.remove('twitch__item--selected');
				}

				$lastBtnCLicked = this;
				this.classList.toggle('twitch__item--selected');
				const state = this.getAttribute('data-hide');

				[...document.querySelectorAll('.boxes-twitch__box')].forEach(elem => elem.classList.remove('hide'));
				if (state !== 'all') {
					[...document.querySelectorAll(`[data-js='${state}']`)].forEach(elem => elem.classList.add('hide'));
				}
			});
		});
	}

	function initTwitch() {
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

	function initView() {
		initTwitch();
		initEvents();
	}

	window.addEventListener('load', initView);

}(window, document));
