import { InstanceBase, InstanceStatus, TCPHelper, type SomeCompanionConfigField } from '@companion-module/base'
import { UpdateActions, type ActionsSchema } from './actions.js'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpgradeScripts } from './upgrades.js'
import { UpdateResponse, UpdateVariableDefinitions, type VariablesSchema } from './variables.js'

export type ModuleSchema = {
	config: ModuleConfig
	secrets: undefined
	actions: ActionsSchema
	feedbacks: Record<string, never>
	variables: VariablesSchema
}

export { UpgradeScripts }

/** Shows control characters (`\r`, `\n`, …) in log lines */
function describe(data: string | Buffer): string {
	return typeof data === 'string' ? JSON.stringify(data) : `hex ${data.toString('hex')}`
}

export default class ModuleInstance extends InstanceBase<ModuleSchema> {
	config!: ModuleConfig

	#socket: TCPHelper | undefined
	/** Last network error logged, so a retry loop does not log the same failure again */
	#lastNetworkError: string | undefined

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig): Promise<void> {
		UpdateActions(this)
		UpdateVariableDefinitions(this)
		await this.configUpdated(config)
	}

	async destroy(): Promise<void> {
		this.#socket?.destroy()
		this.#socket = undefined
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = config
		this.#initTCP()
	}

	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	send(data: string | Buffer): void {
		if (!this.#socket?.isConnected) {
			this.log('warn', `Not connected, unable to send ${describe(data)}`)
			return
		}

		this.log('debug', `Sending: ${describe(data)}`)
		this.#socket.send(data)
	}

	#initTCP(): void {
		this.#socket?.destroy()
		this.#socket = undefined
		this.#lastNetworkError = undefined

		if (!this.config.host) {
			this.updateStatus(InstanceStatus.BadConfig, 'No device IP configured')
			return
		}

		this.updateStatus(InstanceStatus.Connecting)
		const socket = new TCPHelper(this.config.host, this.config.port)
		this.#socket = socket

		socket.on('status_change', (status, message) => {
			this.updateStatus(status, message)
		})

		socket.on('connect', () => {
			this.#lastNetworkError = undefined
			this.log('debug', 'Connected')
		})

		// Serial data has no framing, so each chunk received is treated as the response
		socket.on('data', (data) => {
			this.log('debug', `Received: ${describe(data)}`)
			UpdateResponse(this, data)
		})

		socket.on('error', (err) => {
			// TCPHelper emits this on every retry, about every 2 seconds, until the connection succeeds
			if (this.#lastNetworkError === err.message) return
			this.#lastNetworkError = err.message
			this.log('error', `Network error: ${err.message}`)
		})
	}
}
