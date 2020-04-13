import React from "react"
import PropTypes from 'prop-types'

const StatisticDetails = ({statistic}) => {
  return (statistic
    ? (<>
        <div className="statistic-details">{statistic.ip}</div>
        <p>
          <strong>IP:</strong> {statistic.ip ? statistic.ip : 'N/A'} <br />
          <strong>Successful:</strong> {statistic.successful ? statistic.successful : 'N/A'} <br />
          <strong>Rejected:</strong> {statistic.rejected ? statistic.rejected : 'N/A'}
        </p>
      </>)
    : (<>
        <div className="statistic-details">Select an statistic</div>
      </>)
  )
}

export default StatisticDetails

StatisticDetails.propTypes = {
  stadisticData: PropTypes.object
};
