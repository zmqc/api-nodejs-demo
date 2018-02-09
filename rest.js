const crypto = require('crypto');
const https = require('https');
const querystring = require('querystring');
const host = 'api.kkcoin.com'

var Trader = function(config) {
  this.name = 'kkcoin';
  this.key = config.key;
  this.secret = config.secret;
  this.passphrase = config.passphrase;
}

Trader.prototype.sign = function(str) {
	var self = this;
	var signer = crypto.createSign('RSA-SHA256');
	return signer.update(str).sign({'key':self.secret, 'passphrase':self.passphrase}, 'base64');
}

Trader.prototype.trade = function(asset, currency, orderop, price, amount, callback) {
    var self = this;
    var api = '/rest/trade'
	var time_now = Math.floor(new Date().getTime() / 1000);
	if (orderop != 'BUY' && orderop != 'SELL'){
		cb('orderop error');
	}else{
		var payload = {
			amount : String(amount),
			orderop : String(orderop),
			ordertype : "LIMIT",
			price : String(price),
			symbol : asset + '_' + currency
		};
		var message = JSON.stringify(payload);
		var signature = self.sign('trade' + message + time_now);
		
		const options = {
			host: host,
			path: api,
			method: 'POST',
			headers: {'KKCOINAPIKEY': self.key, 'KKCOINSIGN': signature, 'KKCOINTIMESTAMP':time_now, 'Content-Type': 'application/x-www-form-urlencoded'}
		};
		const req = https.request(options, (res) => {
			res.setEncoding('utf8');
			res.on('data', (chunk) => {
				//console.log(`BODY: ${chunk}`);
				callback(null, chunk);
			});
			res.on('end', () => {
			});
		});

		req.on('error', (e) => {
			//console.error(`problem with request: ${e.message}`);
			callback(e.message, null);
		});
		
		var params = querystring.stringify(payload);
		req.write(params);
		req.end();
	}
}

Trader.prototype.balance = function(callback) {
    var self = this;
    var api = '/rest/balance'
	var time_now = Math.floor(new Date().getTime() / 1000);
	var payload = [];
	var message = JSON.stringify(payload);
	var signature = self.sign('balance' + message + time_now);
	
	const options = {
		host: host,
		path: api,
		method: 'GET',
		headers: {'KKCOINAPIKEY': self.key, 'KKCOINSIGN': signature, 'KKCOINTIMESTAMP':time_now, 'Content-Type': 'application/x-www-form-urlencoded'}
	};
	const req = https.request(options, (res) => {
		res.setEncoding('utf8');
		var data = '';
		res.on('data', (chunk) => {
			//console.log(`BODY: ${chunk}`);
			data += chunk;
		});
		res.on('end', () => {
			callback(null, data);
		});
	});

	req.on('error', (e) => {
		//console.error(`problem with request: ${e.message}`);
		callback(e.message, null);
	});
	req.end();
}

module.exports = Trader;
