var fs = require('fs');
var path = require('path');
var kkcoin = require('./rest.js');

var api_key = '';  //api-key，在kkcoin上填入rsa公钥后获得
var secretFile = path.join(__dirname, 'storage/yourprivate.key');
var api_sec = fs.readFileSync(secretFile);
var api_sec_passphrase = 'KKCOIN.COM';
var kkcoin_config = {
	key : api_key,
	secret : api_sec,
	passphrase : api_sec_passphrase
}
var kk_rest = new kkcoin(kkcoin_config);

var asset = 'EOS';
var currency = 'ETH';
var order_op = 'SELL';
var price = 0.01;
var amount = 9;

kk_rest.trade(asset, currency, order_op, price, amount, function(err, ret){
	console.log(err, ret);
})

kk_rest.balance(function(err, ret){
	console.log(err, ret);
})