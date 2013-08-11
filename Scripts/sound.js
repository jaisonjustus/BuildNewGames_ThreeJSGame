/* Wrapping AudioCOntext. */
window.AudioContext = (
	window.AudioContext ||
	window.webkitAudioContext ||
	null
);

/**
 * Module to handle the ambience for the asylum
 * @module Ambience
 */
var Ambience = {

	_context : null,

	_audioSources : {
		hit : {
			source : 'hit',
			pos : { x : 0, y : 0, z : 0 },
			gain : 3,
			loop : false,
			format : 'mp3'
		}
	},

	_buffer : {},

	_sounds : {},

	init : function()	{
		this._context = new AudioContext();
		this._getSounds();
	},

	_createSoundNode : function(identifier)	{

		var tempSource = {},
				pos = this._audioSources[identifier].pos;

		tempSource.source = this._context.createBufferSource();
		tempSource.volume = this._context.createGain();
		tempSource.panner = this._context.createPanner();

		tempSource.volume.gain.value = this._audioSources[identifier].gain;
		tempSource.source.buffer = this._context.createBuffer(this._buffer[identifier], false);
		tempSource.source.connect(tempSource.volume);
		tempSource.volume.connect(tempSource.panner);
		tempSource.panner.connect(this._context.destination);
		tempSource.source.loop = (this._audioSources[identifier].loop) ? true : false;
		
		this._sounds[identifier] = tempSource;
	},

	_addToBuffer : function()	{
		console.log('add to buffer');
		var that = this.context,
				identifier = this.identifier,
				response = this.response;

		that._buffer[identifier] = response;
		console.log(that);
		console.log(identifier, that._buffer);
	},

	_getSounds :function()	{
		for(var source in this._audioSources)	{
			this.fetch(
				this._audioSources[source].source, 
				this._audioSources[source].format,
				this._addToBuffer,
				this
			);
		}
	},

	fetch : function(source, format, callback, context)	{

		var url = 'sounds/' + source + '.' + format,
				XHR = null;
				
		XHR = new XMLHttpRequest();
		XHR.open("GET", url, true);
		XHR.responseType = "arraybuffer";
		XHR.context = context;
		XHR.identifier = source;
		XHR.onload = callback;
		XHR.send();
	},

	playAt : function(identifier, x, y, z)	{
		this._createSoundNode(identifier);
		this._position(identifier, x, y, z);
		this._sounds[identifier].source.start(this._context.currentTime);
	},

	_position : function(identifier, x, y, z)	{
		this._sounds[identifier].x = x;
		this._sounds[identifier].y = y;
		this._sounds[identifier].z = z;
	}

};