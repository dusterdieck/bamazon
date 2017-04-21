var inquirer = require('inquirer'),
	Table = require('cli-table'),
	formatCurrency = require('format-currency'),
	bamazon = require('./bamazon.js');


// use to reformat currency strings 
let opts = { format: '%s%v', symbol: '$' }
// console.log(formatCurrency('$10,000,000.15 USD', opts)) // => $10,000,000.15 

start();

function start() {
	inquirer.prompt({
		type: 'list',
		message: 'Please selection an option.',
		choices: ['PURCHASE', 'EXIT'],
		name: 'choice'
	}).then( function(answer) {

			switch( answer.choice ){

				case 'EXIT':
				  bamazon.close();
				  return;
				  break;

				case 'PURCHASE':
				   purchase();
				   break;

				default:
					console.log('Please select a valid option');
					start();
			}
	});
}
	

function purchase() {

	bamazon.retrieveAll( function( res ){
		let table = new Table({
					head: ['ID', 'Product', 'Price']
				});

		for( let i = 0; i < res.length; i++){
			table.push( [res[i].item_id, res[i].product_name, formatCurrency(res[i].price, opts)] );

		}
		console.log( table.toString() );


		inquirer.prompt([{
			type: 'input',
			message: 'Enter the ID of the product you would like to purchase:',
			name: 'id'
		},
		{	type: 'input',
			message: 'Enter the quantity you would like to purchase:',
			name: 'qty'
		}]).then( function(answer) {
			if( answer.id && answer.qty ){
				bamazon.purchase( parseInt(answer.id), parseFloat(answer.qty), function( successful, price ){
					if (successful){
						console.log('\nYour purchase total is ' + formatCurrency(parseFloat(answer.qty) * parseFloat(price), opts) + '.\n');
						start();
					}
					else{
						console.log('\nInsufficient Qqantity to place this order!');
						console.log('Try again!\n');
						purchase();
					}
				});
			}
			else{
				console.log('Invalid entry');
				start();
			}

		});
	});
}

