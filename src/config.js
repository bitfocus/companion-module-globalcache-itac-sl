const { Regex } = require('@companion-module/base')

module.exports = {
	getConfigFields() {
		return [
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'This module controls an itac IP2SL device by <a href="https://www.globalcache.com/products/itach/ip2slspecs/" target="_new">Global Cache</a>.'
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'IP',
				width: 4,
				regex: Regex.IP
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Port',
				width: 4,
				regex: Regex.PORT,
				default: 4999
			},
			{
				type: 'dropdown',
				id: 'convertresponse',
				label: 'Convert TCP Response Format',
				default: 'none',
				choices: [
					{ id: 'none', label: 'No conversion' },
					{ id: 'hex', label: 'To Hex' },
					{ id: 'string', label: 'To String' },
				]
			},
		]
	},
}
