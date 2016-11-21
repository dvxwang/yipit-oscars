# yipit-oscars ReadMe

To Run: 

	1. npm install
	2. npm start
	3. visit 'http://localhost:1234/'

To Test:

	1. npm install
	2. npm test

Average budget (2016 USD):

	$41,272,263

Approach Summary:

	(Assumes all budgets are shown in award year inflation rates)
	1. Get all data from API homepage
	2. Select winner from each year and sanitzie year/ movie title
	3. For each movie, follow API URL to pull in budget information
	4. Clean up budget, and replace unavailable budgets with "N/A"
	5. Convert all budgets to integers (using USD values if available), and placed in middle of range (if applicable)
	6. Adjust all budgets to Jan 2016 inflation rates (based on local currency)
	7. Convert foreign correncies to USD at Jan 2016 exchange rates
	8. Find average of total budgets, excluding unavailable budgets (which are captured in separate list)

Third party libraries:

	"chalk": "^1.1.3",
    "express": "^4.14.0",
    "mocha": "^3.1.2",
    "nodemon": "^1.10.2",
    "path": "^0.12.7",
    "request": "^2.79.0",
    "request-promise": "^4.1.1"