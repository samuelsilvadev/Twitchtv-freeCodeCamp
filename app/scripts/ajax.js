const AjaxModule = (function AjaxModule(window) {
	function AJAX() {
		function _serialize(obj, prefix) {
			const str = [];

			Object.entries(obj)
				.forEach((p) => {
					const k = prefix ? `${prefix}[${p}]` : p;
					const v = obj[p];
					str.push((v && typeof v === 'object') ?
						_serialize(v, k) :
						`${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
				});
			return str.join('&');
		}

		function _initAjax(verb, url) {
			const ajax = new window.XMLHttpRequest();
			ajax.open(verb, url, true);
			return ajax;
		}

		function _handleAjax(ajax) {
			return new Promise((resolve, reject) => {
				ajax.addEventListener('readystatechange', () => {
					if (ajax.readyState === 4 && ajax.status === 200) {
						try {
							const data = JSON.parse(ajax.responseText);
							resolve(data);
						} catch (err) {
							console.error(err);
							reject(new Error({ err: true, msg: err, status: ajax.status }));
						}
					}

					if (ajax.readyState === 4 && ajax.status !== 200) {
						reject(new Error({ err: true, msg: '', status: ajax.status }));
					}
				}, false);
			});
		}

		return {
			get: function get(url) {
				const ajax = _initAjax('GET', url);
				ajax.send();
				return _handleAjax(ajax);
			},
			post: function post(url, data) {
				const ajax = _initAjax('POST', url);
				ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				ajax.send(_serialize(data));
				return _handleAjax(ajax);
			},
			del: function del(url, data) {
				const ajax = _initAjax('DELETE', url);
				ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				ajax.send(data);
				return _handleAjax(ajax);
			},
		};
	}

	return AJAX();
}(window));

module.exports = AjaxModule;
