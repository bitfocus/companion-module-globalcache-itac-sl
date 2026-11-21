import type ModuleInstance from './main.js'

export type VariablesSchema = {
	response: string | undefined
	response_hex: string | undefined
}

export function UpdateVariableDefinitions(self: ModuleInstance): void {
	self.setVariableDefinitions({
		response: { name: 'Last Response from Device' },
		response_hex: { name: 'Last Response from Device (Hex)' },
	})
}

export function UpdateResponse(self: ModuleInstance, data: Buffer): void {
	self.setVariableValues({
		response: data.toString(),
		response_hex: data.toString('hex'),
	})
}
