import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

/** The serial port of an iTach IP2SL; a GC-100 numbers its serial ports from here */
export const DEFAULT_PORT = 4999

export type ModuleConfig = {
	host: string
	port: number
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'static-text',
			id: 'info',
			width: 12,
			label: 'Information',
			value:
				'This module sends serial data through a Global Cache iTach IP2SL, a GC-100 serial port, or a computer running ser2net.',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Device IP',
			width: 6,
			regex: Regex.IP,
		},
		{
			type: 'number',
			id: 'port',
			label: 'Port',
			description: '4999 on an iTach IP2SL; on a GC-100, 4999 for the first serial port, 5000 for the second',
			width: 3,
			min: 1,
			max: 65535,
			default: DEFAULT_PORT,
		},
	]
}
