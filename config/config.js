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

if (process.env.NODE_ENV === 'dev') {
    process.env.DATABASE = 'mongodb://localhost/cafe';
} else {
    process.env.DATABASE = 'mongodb+srv://master:PEPkVO9YAGRlDKZI@cluster-sandbox.gq64z.mongodb.net/cafe?retryWrites=true&w=majority';
}