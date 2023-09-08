module.exports = {
	initVariables: function () {
		let self = this;
		let variables = [];

		variables.push({ variableId: 'response', name: 'Last Response from Device' });

		self.setVariableDefinitions(variables);
	},

	checkVariables: function () {
		let self = this;

		try {
			let variableObj = { response: self.response };

			self.setVariableValues(variableObj);
		}
		catch(error) {
			self.log('error', 'Error parsing Variables: ' + String(error));
		}
	}
}
