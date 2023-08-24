module.exports = {
	initActions: function () {
		let self = this;
		let actions = {};

		actions.command = {
			name: 'Command',
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
			],
			callback: async function (action, bank) {
				let opt = action.options;
				let cmd = opt.sl + opt.term;
				self.sendCommand(cmd);
			}
		};
		
		actions.hexcommand = {
			name: 'HEX Command',
			options: [
				{
					 type:    'textinput',
					 label:   'Type hex values to send',
					 id:      'hex'
				}
			],
			callback: async function (action, bank) {
				let opt = action.options;

				let hex = opt.hex.replace(/[^A-Fa-f0-9]/g,'');
				if (hex.length % 2 == 1) {
					hex = '0' + hex;
				}

				let cmd = Buffer.from(hex, 'hex');
				self.sendCommand(cmd);
			}
		};

		self.setActionDefinitions(actions);
	}
}