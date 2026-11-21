import type ModuleInstance from './main.js'

export type MatchFormat = 'text' | 'hex'
export type MatchMode = 'equals' | 'contains' | 'regex'

export type FeedbacksSchema = {
	responseMatches: {
		type: 'boolean'
		options: {
			format: string
			mode: string
			value: string
			ignoreCase: boolean
		}
	}
}

/**
 * Hex is compared as lowercase digits with separators removed, so `81 01 FF` matches `8101ff`.
 * A regex is tested against the response as received in text mode, or its lowercase hex in hex mode.
 * Throws for an invalid regex.
 */
export function responseMatches(
	response: Buffer,
	format: MatchFormat,
	mode: MatchMode,
	value: string,
	ignoreCase: boolean,
): boolean {
	if (mode === 'regex') {
		const subject = format === 'hex' ? response.toString('hex') : response.toString()
		return new RegExp(value, ignoreCase || format === 'hex' ? 'i' : '').test(subject)
	}

	let subject: string
	let expected: string
	if (format === 'hex') {
		subject = response.toString('hex')
		expected = value.replace(/[^A-Fa-f0-9]/g, '').toLowerCase()
	} else {
		subject = response.toString()
		expected = value
		if (ignoreCase) {
			subject = subject.toLowerCase()
			expected = expected.toLowerCase()
		}
	}

	return mode === 'equals' ? subject === expected : subject.includes(expected)
}

export function UpdateFeedbacks(self: ModuleInstance): void {
	self.setFeedbackDefinitions({
		responseMatches: {
			type: 'boolean',
			name: 'Response Matches',
			description: 'The last response from the device matches the value',
			options: [
				{
					type: 'dropdown',
					label: 'Compare As',
					id: 'format',
					default: 'text',
					choices: [
						{ id: 'text', label: 'Text' },
						{ id: 'hex', label: 'Hex' },
					],
					disableAutoExpression: true,
				},
				{
					type: 'dropdown',
					label: 'Match',
					id: 'mode',
					default: 'contains',
					choices: [
						{ id: 'equals', label: 'Equals' },
						{ id: 'contains', label: 'Contains' },
						{ id: 'regex', label: 'Regular Expression' },
					],
					disableAutoExpression: true,
				},
				{
					type: 'textinput',
					label: 'Value',
					description: 'In hex, characters other than 0-9 and A-F are ignored (except in a regular expression)',
					id: 'value',
					default: '',
					useVariables: true,
				},
				{
					type: 'checkbox',
					label: 'Ignore Case',
					id: 'ignoreCase',
					default: false,
					isVisibleExpression: `$(options:format) == 'text'`,
				},
			],
			defaultStyle: {
				color: 0x000000,
				bgcolor: 0x00cc00,
			},
			callback: ({ options }) => {
				const response = self.lastResponse
				if (!response || !options.value) return false

				try {
					return responseMatches(
						response,
						options.format as MatchFormat,
						options.mode as MatchMode,
						options.value,
						options.ignoreCase,
					)
				} catch (err) {
					self.log('warn', `Invalid regular expression "${options.value}": ${(err as Error).message}`)
					return false
				}
			},
		},
	})
}
