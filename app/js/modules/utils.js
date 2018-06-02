var levelsConfig = require('../configs/levels');
var config = require('../configs/config');
var UI = require('../configs/ui');

module.exports = {
	formatTime: function (timeInSeconds) {
		var minutes = (Math.floor(timeInSeconds / 60)).toString();
		var seconds = (timeInSeconds % 60).toString();
		if (minutes.length == 1) minutes = '0' + minutes;
		if (seconds.length == 1) seconds = '0' + seconds;
		return minutes + ":" + seconds;
	},
	levelNumber: function (block, level) {
		return levelsConfig.slice(0, block).reduce(function (acc, curr) { return acc + curr.length; }, 0) + level + 1;
	},
	isMobile: function()
	{
		return Phaser.Device.iOS || Phaser.Device.android;
	},
	getUIScale: function (mobileScale) {
		return this.isMobile() ? (mobileScale || UI.popups.mobileScale) : 1;
	},
	shuffle: function (a) {
		var j, x, i;
		for (i = a.length - 1; i > 0; i--) {
			j = Math.floor(Math.random() * (i + 1));
			x = a[i];
			a[i] = a[j];
			a[j] = x;
		}
		return a;
	},
	copyArray: function (a) {
		var newArray = [];
		a.forEach(function (i) { newArray.push(i) });
		return newArray;
	},
	distance: function (a, b) {
		return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
	},
	backgroundFullSize: function (sprite, doScale) {
		sprite.anchor.set(0.5);
		sprite.x = config.width / 2;
		sprite.y = config.height / 2;

		if (doScale) {
			sprite.scale.set(
				config.width > sprite.width
					? config.width / sprite.width
					: config.height / sprite.height
			);
		}
	},
	isSmallAspect: function()
	{
		return config.width / config.height < 1.6
	},
	setBodySize: function(body, w, h, bodyScale, worldScale)
	{
		body.setSize(
			w * bodyScale * worldScale, 
			h * bodyScale * worldScale, 
			(w * worldScale- w * bodyScale * worldScale) /2, 
			(h * worldScale - h * bodyScale * worldScale) /2
		);
	}
}
