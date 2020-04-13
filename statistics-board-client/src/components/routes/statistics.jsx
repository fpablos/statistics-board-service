import React from 'react'
import { Link } from "react-router-dom"
import { Column, Row } from "simple-flexbox"

import { useQuery } from '@apollo/react-hooks'
import { statisticsGql } from './statistics-gql'
import withApolloProvider from '../hoc/withApolloProvider'
import StatisticList from '../partial/statistic-list'
import StatisticDetails from '../partial/statistic-details'

const Statitics = ({match}) => {
  const statisticIp = Number(match.params.id);
  const { loading, error, data } = useQuery(statisticsGql);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( <span style={{color: 'red'}}>{error.message}</span> )</p>;

  const statistics = data.proxyStatistics;
  const statistic = match.params.id ? statistics.find(a => a.ip === statisticIp) : null;

  return (
    <>
      <Link className='menu' to={`/statistics`}>
        <h1>Statistics</h1>
      </Link>
      <Row horizontal="spaced">
        <Column flexGrow={1} style={{ minWidth: '280px', width: '65%' }}>
          <StatisticList statistics={statistics} />
        </Column>
        <Column flexGrow={1} style={{ width: '45%' }}>
          <StatisticDetails statistic={statistic} />
        </Column>
      </Row>
    </>
  )
}

const WrappedStatistics = withApolloProvider(Statitics, 'http://localhost:5000/graphql')
export default WrappedStatistics;
