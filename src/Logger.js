

//----------------------------------------------------------------
// The imports
//----------------------------------------------------------------


/**
 * Colors
 *
 * @type {Object}
 */
let colors = require('colors/safe');


/**
 * Table
 * @type {Function}
 */
let Table = require('cli-table');




//================================================================
// The logger
//================================================================


/**
 * The logger.
 *
 * @type {Object}
 */
let logger = {


	/**
	 * Create a template processing log.
	 *
	 * @return {Object} The template processing log.
	 */
	createTemplateProcessingLog: function createTemplateProcessingLog() {
		return new TemplateProcessingLog();
	},


};



//----------------------------------------------------------------
// The template processing log
//----------------------------------------------------------------


/**
 * The TemplateProcessingLog type
 *
 */


/**
 * Create a template processing log.
 *
 * @constructor
 */
function TemplateProcessingLog() {
	this.templateFileLogs = [];
}


/**
 * Create and add a template file log.
 *
 * @param  {string} src    The source template file.
 * @param  {string} target The compiled target file.
 *
 * @return {Object}        The template file log.
 */
TemplateProcessingLog.prototype.addTemplateFileLog = function addTemplateFileLog(src, target) {
	var templateFileLog = new TemplateFileLog(src, target);
	this.templateFileLogs.push(templateFileLog);
	return templateFileLog;
};


/**
 * Return a string representing the template processing log.
 *
 * @return {string} The string representing the template processing log.
 */
TemplateProcessingLog.prototype.toString = function toString() {
	let page = new Table({
		chars: {
			'top-mid': '',
			'left-mid': '',
			'right-mid': '',
			'bottom-mid': '',
			'mid': '',
			'middle': '',
			'mid-mid': '',
		},
		style: {},
	});
	page.push([
		colors.bold('Template processing'.toUpperCase())
	]);
	page.push([
		new Date().toLocaleString()
	]);
	if (this.templateFileLogs.length) {
		for (var i = 0; i < this.templateFileLogs.length; ++i) {
			page.push(['']);
			page.push([
				this.templateFileLogs[i].toString()
			]);
		}
	}
	else {
		page.push(['']);
		page.push(['No template file.']);
	}
	return page.toString();
};


/**
 * Print the template processing log to console.
 *
 */
TemplateProcessingLog.prototype.print = function print() {
	console.log('');
	console.log(this.toString());
	console.log('');
};


/**
 * The TemplateFileLog type
 *
 */


/**
 * Create a template file log.
 *
 * @constructor
 *
 * @param       {string} src    The source template file.
 * @param       {string} target The compiled target file.
 */
function TemplateFileLog(src, target) {
	this.templateFile = {
		source: src,
		target: target
	};
	this.isCompilationPerfect = true;
	this.templateTagLogs = new Table({
		chars: {
			'top-mid': '',
			'bottom-mid': '',
			'middle': '',
			'mid-mid': '',
		},
		style: {},
	});
}


/**
 * Add a template tag log.
 *
 * @param {string} tag      The template tag.
 * @param {string} [result] The compiled tag.
 */
TemplateFileLog.prototype.addTemplateTagLog = function addTemplateTagLog(tag, result) {
	let templateTagLog = new TemplateTagLog(tag, result);
	this.isCompilationPerfect = this.isCompilationPerfect && templateTagLog.isCompiled();
	this.templateTagLogs.push(
		templateTagLog.toTableRow()
	);
};


/**
 * Return a string representing the template file log.
 *
 * @return {string} The string representing the template file log.
 */
TemplateFileLog.prototype.toString = function toString() {
	let block = new Table({
		chars: {
			'top-mid': '',
			'left-mid': '',
			'right-mid': '',
			'bottom-mid': '',
			'mid': '',
			'middle': '',
			'mid-mid': '',
		},
		style: {},
	});
	let color = this.isCompilationPerfect ? 'green' : 'magenta';
	block.push(['Source: ' + colors[color].bold(this.templateFile.source)]);
	block.push(['Target: ' + colors[color].bold(this.templateFile.target)]);
	block.push([this.templateTagLogs.toString()]);
	return block.toString();
};


/**
 * The TemplateTagLog type
 *
 */


/**
 * Create a template tag log.
 *
 * @constructor
 *
 * @param       {string} tag      The template tag.
 * @param       {string} [result] The compiled tag.
 */
function TemplateTagLog(tag, result) {
	this.templateTag = tag;
	this.compiledTag = result;
}


/**
 * Determine whether the template tag is compiled or not.
 *
 * @return {boolean} True if the template tag is compiled, otherwise false.
 */
TemplateTagLog.prototype.isCompiled = function isCompiled() {
	return typeof this.compiledTag !== 'undefined';
};


/**
 * Return a table row representing the template tag log.
 *
 * @return {string[]} The table row representing the template tag log.
 */
TemplateTagLog.prototype.toTableRow = function toTableRow() {
	if (this.isCompiled()) {
		return [
			colors.blue.bold('' + this.templateTag),
			' -> ',
			colors.green.bold('' + this.compiledTag),
		];
	}
	return [
		colors.magenta.bold('' + this.templateTag),
		'',
		'',
	];
};



//----------------------------------------------------------------
// The exports
//----------------------------------------------------------------


/**
 * The logger.
 *
 * @type {Object}
 */
module.exports = logger;
