const mongoose = require('mongoose');
const config = require('config');

function con(){
    console.log('function called')
    try{
        const conn = mongoose.createConnection("mongodb://localhost:27017/vidly", {
            useNewUrlParser: true,
            useUnifiedTopology: true
          });
        console.log('Connected to DB',conn);
        conn.on('conne', () => console.log('Fucked'))
    }
    catch(err)
    {
        console.log(err.message);
    }
}
con();

