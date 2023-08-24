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
				type: 'checkbox',
				id: 'convert',
				label: 'Convert Response to String',
				default: false
			}
		]
	},
}
