Meteor.startup(function() {
    // set providor, which should be a geth node
    // my RPC settings are: 
    // geth --rpc --rpcaddr="0.0.0.0" --rpccorsdomain="*" --mine --unlock=YOUR_ACCOUNT --verbosity=5 --maxpeers=0 --minerthreads="3"
    if(!web3.currentProvider)
        web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));

});


if (Meteor.isClient) {

    Session.setDefault('balance', '0');

    // when the template is rendered
    Template.balance.onRendered(function() {

        // balance update interval is 1 sec
        this.updateBalance = Meteor.setInterval(function() {
            // get the coinbase address balance
            web3.eth.getBalance(web3.eth.coinbase, function(err, result){            
                // set global temp session balance with result
                Session.set("balance", String(result));
            });
        }, 1 * 1000);
    });

    // when the template is destroyed
    Template.balance.onDestroyed(function() {
        // clear the balance update interval
        Meteor.clearInterval(this.updateBalance);
    });

    Template.balance.helpers({
        'watchBalance': function(){        
    		return EthTools.formatBalance(Session.get('balance'), '0,0 unit', 'ether');
        },
    });

}
