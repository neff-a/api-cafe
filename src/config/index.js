/*
*   port 
*/

process.env.PORT = process.env.PORT || 3000;

/*
*   env 
*/

process.env.NODE_ENV = process.env.NODE_ENV ||  'dev';

/*
*   database 
*/

process.env.DATABASE = process.env.DATABASE || 'mongodb://localhost/cafe';


/*
*   expiration token
*/

process.env.EXPIRATION_TOKEN = process.env.EXPIRATION_TOKEN || '1h';



/*
*   secret token
*/

process.env.SECRET_TOKEN = process.env.SECRET_TOKEN || 'secret-dev-environment';

/*
* CLIENT ID
*/

process.env.CLIENT_ID = process.env.CLIENT_ID || 'google-client-id';