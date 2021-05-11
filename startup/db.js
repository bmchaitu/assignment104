const mongoose = require('mongoose');
const config = require('config');

function con(){
    try{
        mongoose.connect(config.get('DB_STRING'), {
            useNewUrlParser: true,
            useUnifiedTopology: true
          });
        console.log('Connected to DB');
    }
    catch(err)
    {
        console.log(err.message);
    }
}
con();

