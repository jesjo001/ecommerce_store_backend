import mongoose, { ConnectOptions } from 'mongoose';
import config from 'config';
import log from '../logger'


function connect(){
    const dbUri = process.env.dbUri as string;
    // const dbUri = config.get("dbUri") as string;

    return mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    } as ConnectOptions)
    .then(() =>{
        log.info("Database connected")
    })
    .catch((err) =>{
        log.error("Database Error: ", err);
        process.exit(1)
    })
}

export default connect;