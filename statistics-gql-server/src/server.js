const cors = require('cors');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const couchbase = require('couchbase');

require('dotenv').config();
const { user, pass } = process.env;

const app = express();
app.use(cors());

const cluster = new couchbase.Cluster('couchbase://localhost');

cluster.authenticate({ username: user || 'admin', password: pass || 'a1d2m3i4n5' });

const statistics = cluster.openBucket('proxy_statistics');

const schema = buildSchema(`
  type Query {
    proxyStatistics: [Statistic]
    proxyStatisticsGeneral: [Host]
    proxyStatisticsByIp(ip: String): [Host]
    proxyStatisticsIpByPath(ip: String, byPath: String): [Path]
    proxyStatisticsIpByIp(ip: String, byIp: String): [Host]
    proxyStatistic(ip: String): Statistic
  }
  type Host {
        ip: String,
        rejected: Int,
        successful: Int,
        date: String
  }
  type Path {
        path: String,
        rejected: Int,
        successful: Int,
        date: String
  }
  type Statistic {
    ip: String,
    rejected: Int,
    successful: Int,
    hosts: [Host]!,
    paths: [Path]!
  }
`);

const root = {
  proxyStatistics: () => {
    return new Promise((resolve, reject) => {
      let statement = couchbase.N1qlQuery.fromString("SELECT proxy_statistics.* FROM proxy_statistics");
      statistics.query(statement, (err, rows) => err ? reject(err) : resolve(rows));
    }).catch(e => console.error(e))
  },
  proxyStatisticsGeneral: () => {
    return new Promise((resolve, reject) => {
      let statement = couchbase.N1qlQuery.fromString("SELECT sum(proxy_statistics.successful) as successful, sum(proxy_statistics.rejected) as rejected  from proxy_statistics");
      statistics.query(statement, (err, rows) => err ? reject(err) : resolve(rows));
    }).catch(e => console.error(e))
  },
  proxyStatisticsByIp: (data) => {
    return new Promise((resolve, reject) => {
      let queryString = "SELECT s.ip as ip, s.successful AS successful, s.rejected AS rejected FROM proxy_statistics AS s WHERE s.ip='" + data.ip + "'";
      let statement = couchbase.N1qlQuery.fromString(queryString);
      statistics.query(statement, (err, rows) => err ? reject(err) : resolve(rows));
    }).catch(e => console.error(e))
  },
  proxyStatisticsIpByIp: (data) => {
    return new Promise((resolve, reject) => {
      let queryString = "SELECT hs.ip AS ip, hs.successful AS successful, hs.rejected AS rejected FROM proxy_statistics AS s UNNEST s.hosts AS hs WHERE s.ip='"+data.ip+"' AND hs.ip='"+data.byIp+"'";
      let statement = couchbase.N1qlQuery.fromString(queryString);
      statistics.query(statement, (err, rows) => err ? reject(err) : resolve(rows));
    }).catch(e => console.error(e))
  },
  proxyStatisticsIpByPath: (data) => {
    return new Promise((resolve, reject) => {
      let queryString = "SELECT p.`path` AS `path`, p.successful AS successful, p.rejected AS rejected from proxy_statistics AS s unnest s.paths AS p where s.ip='" + data.ip + "' and p.`path`='" + data.byPath + "'";
      let statement = couchbase.N1qlQuery.fromString(queryString);
      statistics.query(statement, (err, rows) => err ? reject(err) : resolve(rows));
    }).catch(e => console.error(e))
  },
  proxyStatistic: (data) => {
    let dbkey = "statistic_" + data.ip;
    return new Promise((resolve, reject) => {
      statistics.get(
          dbkey, (error, result) => error
              ? reject(error)
              : resolve(result.value)
      )
    }).catch(e => console.error(e))
  }
};

const serverPort = 5000;
const serverUrl = '/graphql';
app.use(serverUrl, graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true
}));

app.listen(serverPort, () => {
  console.log(`GraphQL server now running on http://localhost:${serverPort}${serverUrl}`);
});
