// Connect Neo4j
var neo4j = require('neo4j-driver');
var graphenedbURL = process.env['GRAPHENEDB_URL'] || "neo4j://localhost:7687"
var driver = new neo4j.driver(graphenedbURL,  neo4j.auth.basic("neo4j", "lonke"));
const session = driver.session();


session.run('build_kg_query')
    .then(result => {
        console.log( i ,' completed.');
    })
    .catch(e => {
        console.log(e);
    })
    .then(() => {
        return session.close();
    })
    .then(() => {
        return driver.close();
    });