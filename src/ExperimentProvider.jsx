import React, {useEffect, useState} from 'react'
import PropTypes from 'prop-types'

import toggles from '@toggles/experiments'

import ExperimentContext from './ExperimentContext'
import {isPOJsO} from './util'

export const ExperimentProvider = ({
  apiKey,
  apiUrl,
  children,
  // NOTE: Experiments exposed here mainly for testing purposes.
  experiments: experiments_,
  rapidApiKey,
  ...props
}) => {
  const context = isPOJsO(props.context) ? props.context : {uniqueId: props.context}
  const [experiments, setExperiments] = useState(experiments_)

  useEffect(() => {
    if ((apiKey || rapidApiKey) && apiUrl) {
      const client = toggles.createExperimentClient({apiKey, apiUrl, rapidApiKey})

      client.getExperiments()
        .then((response) => {
          setExperiments(response.reduce((acc, experiment) => {
            acc[experiment.uuid] = {...experiment, active: null} // eslint-disable-line no-param-reassign

            return acc
          }, experiments))

          return Promise.all(experiments.map(({uuid}) => client.isExperimentActive(uuid, context)
            .then((active) => [active, uuid])))
        })
        .then((response) => setExperiments(response.reduce((acc, [active, uuid]) => {
          acc[uuid] = {...experiments[uuid], active} // eslint-disable-line no-param-reassign

          return acc
        }, experiments)))
        .catch(console.error)
    }
  }, [apiKey, apiUrl, context])

  return <ExperimentContext.Provider value={experiments}>
    {children}
  </ExperimentContext.Provider>
}

ExperimentProvider.defaultProps = {
  context: {},
  experiments: {},
}

ExperimentProvider.propTypes = {
  apiKey: PropTypes.string,
  apiUrl: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  context: PropTypes.oneOfType([
    PropTypes.shape({
      uniqueId: PropTypes.string,
    }),
    PropTypes.string,
  ]),
  // NOTE: Experiments exposed here mainly for testing purposes.
  experiments: PropTypes.objectOf(PropTypes.shape({
    active: PropTypes.bool,
    uuid: PropTypes.string,
  })),
  rapidApiKey: PropTypes.string,
}

ExperimentProvider.displayName = 'ExperimentProvider'

export default ExperimentProvider
