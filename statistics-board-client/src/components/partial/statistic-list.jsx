import React from 'react'
import { Link } from "react-router-dom"
import Pagination from '../tools/pagination'

const StatisticList = ({statistics}) => {
  const [statisticsShowing, setStatisticsShowing] = React.useState(statistics.slice(0, 10))

  const onPageChanged = ({ currentPage, totalPages, pageLimit }) => {
    const offset = (currentPage - 1) * pageLimit
    const currentSlice = statistics.slice(offset, offset + pageLimit)
    setStatisticsShowing(currentSlice)
  }

  const listItems =
      statisticsShowing.map(({ ip }) => (
      <li key={`${ip}`}>
        <Link className='menu' to={`/statistics/${ip}`}>{ip}</Link>
      </li>
    )
  )

  return (
    <>
      <ul className={`statistic-list`}>
        {listItems}
      </ul>

      <Pagination totalRecords={statistics.length} pageLimit={10} pageSiblings={1} onPageChanged={onPageChanged} />
    </>
  )
}

export default StatisticList
