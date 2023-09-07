const { TCPHelper, InstanceStatus } = require('@companion-module/base');

module.exports = {
	initTCP: function() {
		let self = this;
	
		if (self.socket !== undefined) {
			self.socket.destroy();
			delete self.socket;
		}
	
		if (self.config.host) {
			if (self.config.port === undefined) {
				self.config.port = 4999;
			}

			self.socket = new TCPHelper(self.config.host, self.config.port);

			self.socket.on('connect', function () {
				self.setVariableValues({'connect_status': 'Connected'});
				self.updateStatus(InstanceStatus.Ok);
			});
	
			self.socket.on('data', function(data) {
				if (self.config.convert == true) {
					try {
						data = data.toString();
					}
					catch(error) {
						//error converting to string
					}
				}

				self.response = data;
				self.checkVariables();
			});
	
			self.socket.on('error', function (err) {
				self.log('error', 'Network error: ' + err.message);
				self.socket.destroy(); //close the socket after receiving the error
			});
		}
	},

	sendCommand: function(cmd) {
		let self = this;

		if (cmd !== undefined) {
			if (self.socket !== undefined && self.socket.isConnected) {
				self.socket.send(cmd);
			} else {
				self.log('debug', 'Socket not connected :(');
			}
		}
	}
}