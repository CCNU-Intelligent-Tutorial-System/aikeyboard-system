const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 4000;
const cors = require('cors');
server.use(middlewares);
server.use(cors);
server.use(jsonServer.bodyParser);

server.get('/api', (req,res)=>{
    res.json({
        status: 'success',
        message:"Welcome to API!"
    });
});
server.use(router);
server.listen(port,()=>{console.log("***JsonServer Running on "+port+"***")});