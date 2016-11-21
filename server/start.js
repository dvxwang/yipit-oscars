'use strict';
var chalk = require('chalk');
var express = require('express');
var app = express();
var path = require('path');
var request = require('request');
var rp = require('request-promise');
var helper = require ('./helpers.js');

app.use(express.static('views'));
app.use(express.static('server'));

app.get('/fetchData', function(req, res, next) {
	
	//Create a promise for making request to API homepage
	var homepageQuery = {
		uri: 'http://oscars.yipitdata.com',
		json: true
	}

	rp(homepageQuery)
	.then(function (initData) {
		
		//Parse out winning movies metadata (name, year, and API URL)
		return initData.results.map(elem=> {
			
			//Remove excess whitespaces and content in parentheses and brackets
			var modDate = helper.cleanYear(elem.year);

			//Search movies array for winning film, and retrieve name and URL
			var winningFilm = elem.films.filter((movie)=> movie.Winner)[0];
			var modWinningFilmTitle = helper.cleanTitle(winningFilm.Film);
			var winningFilmLink = winningFilm['Detail URL'];

			return {
			  origYear: elem.year,
			  modYear: modDate,
			  origMovie: winningFilm.Film, 
			  modMovie: modWinningFilmTitle,
			  link: winningFilmLink
			}
		});
    })
    .then(function (movieWinners) {

    	//Create an array of request promises for individual film metadata
    	var movieRequests = movieWinners.map(elem=>{
    		return rp({uri: elem.link, json: true});
    	})

    	//creates an array of movie winners and budgets
    	return Promise.all(movieRequests)
    	.then(function(result){

    		return movieWinners.map((elem,index) => {
    			
    			var origBudget = result[index].Budget || "N/A";

    			//Removes content in brackets and standardizes hyphen format
    			var modBudget = helper.cleanBracketHyphen(origBudget);

    			//If multiple budgets are provided, default to USD
    			if (modBudget.split(" or ").length > 1){
    				var checkSplit = modBudget.split(" or ");
    				for (var i=0; i<checkSplit.length; i++){
    					if (checkSplit[i].indexOf("$") !== -1) modBudget = checkSplit[i];
    				}
    			}

    			//Discern country based on currency for inflation/exchange rate purposes
    			elem.country = (modBudget.indexOf("$") !== -1) ? 'united-states' : 'united-kingdom'; 
    			
    			//Remove leading spaces, excess whitespace, commas, and currency markers
    			modBudget = helper.cleanCurrency(modBudget);

    			if (modBudget.split("million").length > 1){
    				var checkMillion = modBudget.split("million");
    				var checkRange = checkMillion[0].split("-");
    				if (checkRange.length > 1){
    					
    					//If budget is provided as range, average of range is taken
    					modBudget = (checkRange.reduce((sum, elem)=> {
    						elem = elem.replace(/[\s]|[\$]/g,'');
    						return sum += (+elem);
    					},0)/checkRange.length) + modBudget.replace(/^[^million]*million/g, '')
    				}
    				
    				//Convert 'million' string to numbers
    				modBudget = helper.convertMillions(modBudget);
    			}
    			modBudget = Math.round(+modBudget);

				delete elem.link;
				elem.origBudget = origBudget;
				elem.modBudget = modBudget;
				return elem;			  
    		})
    	});
    })
	.then(function(finalList){

        var today = new Date();

        //Create an array of promise requests for getting inflation adjusted prices
        var inflationRequests = finalList.map(elem=>{
    		
        	//Replace non-valid budget values with 0 for purposes of API call
        	var validBudget = isNaN(elem.modBudget) ? 0 : elem.modBudget;

	        var options = {
	        	url: 'https://www.statbureau.org/calculate-inflation-price-json',
	        	qs: {
	                country: elem.country,
	                start: elem.origYear.slice(0,4)+"-01-01",
	                end: today.getFullYear()+"-01-01",
	                amount: validBudget,
	                format: false
	        	}
	        }
	        return rp(options);
    	})

    	return Promise.all(inflationRequests)
    	.then(function(result){


    		finalList.map((elem,index)=>{

    			//Strip out quotes and round value (replace with "N/A" where necessary)
    			var cleanValue = result[index].replace(/\"/g,"");
    			elem.convertBudget = cleanValue === "0" ? "N/A" : Math.round(cleanValue);
    		})

    		//Get currency exchange rates for USD to GBP (Jan of current year)
    		var exchangeQuery = {
    			uri: 'http://api.fixer.io/'+today.getFullYear()+'-01-01?symbols=USD&base=GBP',
    			json: true
    		}

    		rp(exchangeQuery)
    		.then(function(rate){
    			finalList.map(elem => {
    				if (elem.country==='united-kingdom' && elem.newBudget) elem.convertBudget = Math.round(elem.convertBudget*rate.rates.USD);
    			})
    			res.send(finalList);
    		})
    	})
	})
    .catch(function (err) {
        console.log("Error: ", err);
    });
});

app.get('/*', function(req, res, next) {
	
	res.sendFile(path.join(__dirname, '../views/', 'index.html'));
});

var startServer = function () {
    var PORT = (process.env.PORT || 1234);

    app.listen(PORT, function () {
        console.log(chalk.blue('Server started on port', chalk.magenta(PORT)));
    });

};

startServer();
