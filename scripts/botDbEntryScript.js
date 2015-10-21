// Script for entering all bots into the db.
var n = require('../bot/names');

for (var i=0; i<=n.botnames.length; i++) {
    var newUser = new User();
    newUser.username = n.botnames[i];
    newUser.password = createHash("!" + n.botnames[i] + "BT" + i);
    newUser.save(function(err) {
        if (err) {
            console.log(err);
        }
    })

};