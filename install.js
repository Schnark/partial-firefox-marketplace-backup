(function () {
"use strict";

/*
var fakeMozApps = {
	checkInstalled: function (manifest) {
		var isCorrectUrl = /^https?:\/\/.*\.webapp$/.test(manifest),
			installed = {
			'https://schnark.github.io/partial-firefox-marketplace-backup/backup/webserver.webapp': true
		};
		return fakeMozApps._makeRequest(function () {
			return [isCorrectUrl, manifest in installed];
		});
	},
	install: function (manifest) {
		var isCorrectUrl = /^https?:\/\/.*\.webapp$/.test(manifest);
		return fakeMozApps._makeRequest(function () {
			return [isCorrectUrl];
		});
	},
	installPackage: function (manifest) {
		var isCorrectUrl = /^https:\/\/schnark.github.io\/partial-firefox-marketplace-backup\/backup\/.*\.webapp$/.test(manifest);
		return fakeMozApps._makeRequest(function () {
			return [isCorrectUrl];
		});
	},
	_makeRequest: function (async, time) {
		var request = {};
		setTimeout(function () {
			var result = async();
			request.result = result[1];
			if (result[0]) {
				if (request.onsuccess) {
					request.onsuccess();
				}
			} else {
				if (request.onerror) {
					request.onerror();
				}
			}
		}, time || 1000);
		return request;
	}
}

navigator.mozApps = fakeMozApps;
*/

function makeAbsolute (url) {
	if (url.indexOf('/') === -1) {
		url = 'https://schnark.github.io/partial-firefox-marketplace-backup/backup/' + url;
	}
	return url;
}

function updateButtons () {
	var buttons, i;
	if (!navigator.mozApps || !navigator.mozApps.checkInstalled) {
		return;
	}
	buttons = document.getElementsByTagName('button');
	for (i = 0; i < buttons.length; i++) {
		updateButton(buttons[i]);
	}
}

function updateButton (button) {
	var method = button.dataset.web ? 'install' : 'installPackage',
		manifest = makeAbsolute(button.dataset.manifest),
		request;
	if (!navigator.mozApps[method]) {
		return;
	}
	request = navigator.mozApps.checkInstalled(manifest);
	request.onsuccess = function () {
		if (request.result) {
			button.innerHTML = 'Already installed!&nbsp;<span style="color: green;">✔</span>'
		} else {
			button.addEventListener('click', function () {
				button.disabled = true;
				button.innerHTML = 'Installing …';
				request = navigator.mozApps[method](manifest);
				request.onerror = function () {
					button.innerHTML = 'An error occured';
				};
				request.onsuccess = function () {
					button.innerHTML = 'Successfully installed!&nbsp;<span style="color: green;">✔</span>'
				};
			});
			button.innerHTML = 'Install';
			button.disabled = false;
		}
	};
}

updateButtons();

})();