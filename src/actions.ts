import type ModuleInstance from './main.js'

export type ActionsSchema = {
	command: {
		options: {
			sl: string
			term: string
		}
	}
	hexcommand: {
		options: {
			hex: string
		}
	}
}

export function UpdateActions(self: ModuleInstance): void {
	self.setActionDefinitions({
		command: {
			name: 'Command',
			description: 'Send text to the serial port, followed by the selected line termination',
			options: [
				{
					type: 'textinput',
					label: 'Command',
					id: 'sl',
					default: '',
					useVariables: true,
				},
				{
					type: 'dropdown',
					label: 'Line Termination',
					id: 'term',
					default: '\r',
					choices: [
						{ id: '', label: 'No termination' },
						{ id: '\r', label: 'Carriage Return - \\r' },
						{ id: '\n', label: 'Line Feed - \\n' },
						{ id: '\r\n', label: 'Carriage Return/Line Feed - \\r\\n' },
					],
					disableAutoExpression: true,
				},
			],
			callback: async ({ options }) => {
				const command = options.sl + options.term
				if (!command) {
					self.log('warn', 'Command is empty, nothing sent')
					return
				}
				self.send(command)
			},
		},
		hexcommand: {
			name: 'HEX Command',
			description: 'Send bytes to the serial port, entered as hex. Characters other than 0-9 and A-F are ignored',
			options: [
				{
					type: 'textinput',
					label: 'Hex values to send',
					id: 'hex',
					default: '',
					useVariables: true,
				},
			],
			callback: async ({ options }) => {
				let hex = options.hex.replace(/[^A-Fa-f0-9]/g, '')
				if (!hex) {
					self.log('warn', `No hex values in "${options.hex}", nothing sent`)
					return
				}
				if (hex.length % 2 === 1) hex = `0${hex}`
				self.send(Buffer.from(hex, 'hex'))
			},
		},
	})
}
