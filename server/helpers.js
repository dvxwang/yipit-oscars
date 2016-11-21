//remove whitespaces and content in brackets/parentheses
function cleanYear(year){
	return year.replace(/\s|\([^()]*\)|\[[^\[\]]*\]/g, '')
}

//remove trailing whitespaces and content in brackets
function cleanTitle(title){
	return title.replace(/\[[^\[\]]*\]/g, '').replace(/[\s]+$/g, '');
}

//remove content in brackets, estimations, and standardize hyphens
function cleanBracketHyphen(budget){
	return budget.replace(/\[[^\[\]]*\]|\(est\.\)/g, '').replace(/\u2013|\u2014/g, "-");
}

//remove leading spaces, excess whitespace, commas, and currency markers
function cleanCurrency(budget){
	return budget.replace(/^[^\$]*\$|^[^£]*£|[\s]|,/g,'');
}

//convert 'million' string to numbers
function convertMillions(budget){
	return parseFloat(budget.replace(/million/g,''))*1000000; 
}

//formats budget into monetary format
function addCommas(budget) {
	budget += '';
	if (budget==='"N/A"' || budget==="null") return "N/A";

	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(budget)) {
	  budget = budget.replace(rgx, '$1' + ',' + '$2');
	}
	return "$"+budget;
}

module.exports = {
	cleanYear: cleanYear,
	cleanTitle: cleanTitle,
	cleanBracketHyphen: cleanBracketHyphen,
	cleanCurrency: cleanCurrency,
	convertMillions: convertMillions,
	addCommas: addCommas
};