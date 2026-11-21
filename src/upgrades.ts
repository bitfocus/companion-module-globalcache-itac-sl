import type {
	CompanionStaticUpgradeProps,
	CompanionStaticUpgradeResult,
	CompanionStaticUpgradeScript,
	CompanionUpgradeContext,
} from '@companion-module/base'
import { DEFAULT_PORT, type ModuleConfig } from './config.js'

type Context = CompanionUpgradeContext<ModuleConfig>
type Props = CompanionStaticUpgradeProps<ModuleConfig, undefined>
type Result = CompanionStaticUpgradeResult<ModuleConfig, undefined>

/** Placeholder from the original module; upgrade scripts are tracked by index so it must stay. */
function v2_0_noop(): Result {
	return { updatedConfig: null, updatedActions: [], updatedFeedbacks: [] }
}

/**
 * The port became a number field (it was text), and the "Convert TCP Response Format" setting was replaced
 * by the `response` and `response_hex` variables, which are both always set.
 */
function v3_0_config(_context: Context, { config }: Props): Result {
	if (!config) return { updatedConfig: null, updatedActions: [], updatedFeedbacks: [] }

	const { convertresponse: _convertresponse, ...rest } = config as Omit<ModuleConfig, 'port'> & {
		port?: unknown
		convertresponse?: unknown
	}
	const port = Number(rest.port)
	const updatedConfig: ModuleConfig = {
		...rest,
		port: Number.isInteger(port) && port > 0 && port <= 65535 ? port : DEFAULT_PORT,
	}
	return { updatedConfig, updatedActions: [], updatedFeedbacks: [] }
}

export const UpgradeScripts: CompanionStaticUpgradeScript<ModuleConfig>[] = [v2_0_noop, v3_0_config]
