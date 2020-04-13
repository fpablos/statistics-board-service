import { gql } from 'apollo-boost'

export const statisticsGql = gql`
  {
    proxyStatistics{
      ip
      rejected
      successful
      hosts {
        ip
        rejected
        successful
        date
      }
      paths {
        path
        rejected
        successful
        date
      }
    }
  }
`
