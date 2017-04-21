var mysql = require('mysql');

//this mysql connection should work without any modification on your end.  Has permissions SELECT, INSERT, and UPDATE.
var connection = mysql.createConnection({
	host: 'savssh.myftp.org',
	port: 3242,
	user: 'class',
	password: 'gtbootcamp',
	database: 'bamazon'
});



module.exports = {

	retrieveAll: function( fn ) {
		// connection.connect();
		

		connection.query('SELECT * FROM products', function(err, res){
			if (err) throw err;

			var items = [];
			// console.log('Res', JSON.stringify(res) );
			for( let i = 0; i < res.length; i++){
				items.push({
					item_id: res[i].item_id,
					product_name: res[i].product_name,
					department_name: res[i].department_name,
					price: res[i].price,
					stock_quantity: res[i].stock_quantity
				});
			}

			fn( items );
			
		});
		// connection.end();
		
	},

	purchase: function(id, qty, fn ) {
		// connection.connect();
		connection.query('SELECT stock_quantity, price FROM products WHERE item_id = ?', id, function(err, res) {
			if (err) throw err;

			var stock = res[0].stock_quantity,
				purchaseCompleted;

			if( qty > stock ){
				// console.log('Insufficient Quantity!');
				purchaseCompleted = false;
				// connection.end();
				fn( purchaseCompleted );
			}
			else{
				purchaseCompleted = true;
				var new_stock = stock - qty,
					price = res[0].price;

				connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ?', [new_stock, id], function (error, results, fields) {
					// console.log('changed ' + results.changedRows + ' rows');
					// console.log('Price = ' + price )
					fn( purchaseCompleted, price );
				});
				// connection.end();
			}

			
		});
		
	},

	close: function() {
		connection.end();
	}

};