var tcp = require('../../tcp');
var instance_skel = require('../../instance_skel');
var debug;
var log;

function instance(system, id, config) {
	let self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.getCustomVariables();

	self.init_actions(); // export actions

	return self;
}

instance.prototype.customVariables = [];

instance.prototype.getCustomVariables = function() {
	let self = this;

	self.system.emit('custom_variables_get', (d) => {
		self.customVariables = d;
	});
};

instance.prototype.updateConfig = function(config) {
	let self = this;

	self.config = config;
	self.init_tcp();
};

instance.prototype.init = function() {
	let self = this;

	debug = self.debug;
	log = self.log;

	self.status(self.STATE_UNKNOWN);

	self.init_tcp();
};

instance.prototype.init_tcp = function() {
	let self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
		delete self.socket;
	}

	if (self.config.host) {
		self.socket = new tcp(self.config.host, 4999);

		self.socket.on('status_change', function (status, message) {
			self.status(status, message);
		});

		self.socket.on('data', function(data) {
			if (self.config.storereturn == true) {
				if (self.config.convert == true) {
					try {
						data = data.toString();
					}
					catch(error) {
						//error converting to string
					}
				}
				self.system.emit('custom_variable_set_value', self.config.customvariable, data);			}
		});

		self.socket.on('error', function (err) {
			debug("Network error", err);
			self.log('error',"Network error: " + err.message);
			self.socket.destroy(); //close the socket after receiving the error
		});
	}
};

// Return config fields for web config
instance.prototype.config_fields = function () {
	let self = this;
	return [
		{
			type:  'textinput',
			id:    'host',
			label: 'Device IP',
			width: 12,
			regex: self.REGEX_IP,
		},
		{
			type:  'text',
			id:    'info',
			width: 12,
			label: 'Information',
			value: 'This module controls an itac IP2SL device by <a href="https://www.globalcache.com/products/itach/ip2slspecs/" target="_new">Global Cache</a>.'
		},
		{
			type: 'checkbox',
			id: 'storereturn',
			label: 'Store Return/Response from Serial Device to Custom Variable',
			default: false
		},
		{
			type: 'dropdown',
			label: 'Custom Variable to Store Response In',
			id: 'customvariable',
			choices: Object.entries(self.customVariables).map(([id, info]) => ({
				id: id,
				label: id,
			})),
			isVisible: (config) => config.storereturn == true
		},
		{
			type: 'checkbox',
			id: 'convert',
			label: 'Convert Response to String',
			default: false,
			isVisible: (config) => config.storereturn == true
		}
	]
};

// When module gets deleted
instance.prototype.destroy = function() {
	let self = this;

	if (self.socket !== undefined) {
		self.socket.destroy();
	}

	debug("destroy", self.id);;
};

instance.prototype.init_actions = function(system) {
	let self = this;
	self.setActions({

		'command': {
			label: 'Command',
			options: [
				{
					 type:    'textinput',
					 label:   'Type Command',
					 id:      'sl'
				},
				{
					 type:    'dropdown',
					 label:   'Line Termination',
					 id:      'term',
					 default: '\r',
					 choices:	[
						{ id: '',     label: 'No termination' },
						{ id: '\r',   label: 'Carriage Return - \\r' },
						{ id: '\n',   label: 'Line Feed - \\n' },
						{ id: '\r\n', label: 'Carriage Return/Line Feed - \\r\\n' },
					 ]
				},
			]
		},
		'hexcommand': {
			label: 'HEX based command',
			options: [
				{
					 type:    'textinput',
					 label:   'Type hex values to send',
					 id:      'hex'
				}
			]
		}
	});
}

instance.prototype.action = function(action) {
	let self = this;
	let cmd  = '';
	let opt  = action.options;

	switch (action.action) {

		case 'command':
			cmd += opt.sl + opt.term;
			break;

		case 'hexcommand':
			let hex = opt.hex.replace(/[^A-Fa-f0-9]/g,'');
			if (hex.length % 2 == 1) {
				hex = '0' + hex;
			}

			cmd = Buffer.from(hex, 'hex');
			break;
	}

	if (cmd !== undefined) {

		debug('sending tcp', cmd, "to", self.config.host);

		if (self.socket !== undefined && self.socket.connected) {
			self.socket.send(cmd);
		} else {
			debug('Socket not connected :(');
		}
	}

	debug('action():', action);

};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
