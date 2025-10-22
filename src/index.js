import app from './app.js'
import pkg from 'signale'


const {Signale} =pkg


const main =()=>{
const logger = new Signale({scope:'Main'})

const port = app.get('port');


app.listen(port)
logger.log('puerto andando en '+ port)
}

main()

