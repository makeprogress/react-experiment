import React from 'react'
import PropTypes from 'prop-types'

import {ExperimentContext} from '../ExperimentContext'

export const withExperiments = (Component) => {
  const ExperimentsConnector = ({wrappedComponentRef, ...props}) => <ExperimentContext.Consumer>
    {(experiments) => <Component {...props} experiments={experiments} ref={wrappedComponentRef}/>}
  </ExperimentContext.Consumer>

  ExperimentsConnector.displayName = `withExperiments(${Component.displayName || Component.name})`
  ExperimentsConnector.WrappedComponent = Component

  ExperimentsConnector.propTypes = {
    wrappedComponentRef: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.func,
      PropTypes.object,
    ]),
  }

  return ExperimentsConnector
}

export default withExperiments
