// Connect Neo4j
var neo4j = require('neo4j-driver');
var graphenedbURL = process.env['GRAPHENEDB_URL'] || "neo4j://localhost:7687"
var driver = new neo4j.driver(graphenedbURL,  neo4j.auth.basic("neo4j", "lonke"));
const session = driver.session();


var fs = require('fs');
var parse = require('csv-parse');

var concepts=[];



fs.createReadStream('新增离散数学知识点.csv')
    .pipe(parse({delimiter: '#'}))
    .on('data', function(csvrow) {
        if (csvrow && csvrow!==''){
            concepts.push(csvrow);
        }

    })
    .on('end',function() {
        console.log('Complete!');
        // console.log(csvData);
        var queries = []

        for (i=1;i<concepts.length;i++){
            let line = concepts[i];
            let query = '';
            if (line[0]===line[2]){
                query = `MERGE (c:Concept {name: "${line[0]}", explanation: "${line[1]}"})`
            }else{
                query = `MATCH (c0:Concept) WHERE c0.name = "${line[2]}" MERGE (c:Concept {name: "${line[0]}", explanation: "${line[1]}"}) MERGE (c)-[:isA]->(c0)`
            }
            queries.push(query);
        }

        console.log(queries);
        let build_kg_query = queries.join(';'); //复制到 neo4j browser 执行

        // for (let i=0;i<queries.length;i++) {
        //     let tx = session.beginTransaction();
        //     tx.run(queries[i]);
        //     tx.commit();
        // }

        // Promise.all([
        //         queries.map((q)=>(tx.run(q).then(result => {
        //
        //                                             console.log( result );
        //                                         })
        //                                         .catch(e => {
        //                                             console.log(e);
        //                                         })
        //
        //             ))
        // ])
        //     .then((results) => {
        //
        //         console.log('Build KG Complete!')
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //
        //     });
        // for (let i=0;i<queries.length;i++){
        //     let query = queries[i];

        //     session.run(build_kg_query)
        //     .then(result => {
        //         console.log( i ,' completed.');
        //     })
        //     .catch(e => {
        //         console.log(e);
        //     })
        //     .then(() => {
        //         return session.close();
        //     })
        //     .then(() => {
        //         return driver.close();
        //     });
        // }


    });

// let properties=[];
//
// fs.createReadStream('离散数学性质.csv')
//     .pipe(parse({delimiter: '#'}))
//     .on('data', function(csvrow) {
//         if (csvrow && csvrow!==''){
//             properties.push(csvrow);
//         }
//
//     })
//     .on('end',function() {
//         console.log('Complete!');
//
//         var queries = []
//
//         for (i=1;i<properties.length;i++){
//             let line = properties[i];
//             let query = `MATCH (c:Concept) WHERE c.name = "${line[0]}" MERGE (p:Property {content: "${line[1]}"}) MERGE (p)-[:propertyOf]->(c)`
//             queries.push(query);
//         }
//
//         let build_kg_query = queries.join(';'); //复制到 neo4j browser 执行
//
//     });
