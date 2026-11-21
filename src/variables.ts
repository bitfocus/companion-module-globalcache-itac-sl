import type ModuleInstance from './main.js'

export type VariablesSchema = {
	response: string | undefined
	response_hex: string | undefined
	response_time: number | undefined
}

export function UpdateVariableDefinitions(self: ModuleInstance): void {
	self.setVariableDefinitions({
		response: { name: 'Last Response from Device' },
		response_hex: { name: 'Last Response from Device (Hex)' },
		response_time: { name: 'Time of Last Response (Unix time, ms)' },
	})
}

export function UpdateResponse(self: ModuleInstance, data: Buffer, receivedAt: number): void {
	self.setVariableValues({
		response: data.toString(),
		response_hex: data.toString('hex'),
		response_time: receivedAt,
	})
}
