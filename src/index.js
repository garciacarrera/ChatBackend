import app from './app.js';

import pkg from 'signale';

const { Signale } = pkg;
import AppDataSource from './provider/datasource-provider.js';

const main = () => {
    //# Le damos el scope
    const logger = new Signale({ scope: 'Main' });

    const port = app.get('port');

    AppDataSource.initialize()
        .then(() => logger.log('Connected to database'))
        .catch(() => logger.log('Unable to connect to database'));

    app.listen(port);
    // # En vez de usar console.log, usamos signale para los logs
    logger.log('server running on port ' + port);
};

main();
