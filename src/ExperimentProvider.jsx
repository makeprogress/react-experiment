import {useEffect, useState} from 'react'
import PropTypes from 'prop-types'

import toggles from '@toggles/experiments'

import ExperimentContext from './ExperimentContext'
import {isPOJsO} from './util'

export const ExperimentProvider = ({
  apiKey,
  apiUrl,
  children,
  rapidApiKey,
  ...props
}) => {
  const context = isPOJsO(props.context) ? props.context : {uniqueId: props.context}
  const [experiments, setExperiments] = useState([])

  useEffect(() => {
    if ((apiKey || rapidApiKey) && apiUrl) {
      const client = toggles.createExperimentClient({apiKey, apiUrl, rapidApiKey})

      client.getExperiments()
        .then((experiments) => {
          setExperiments(experiments.reduce((acc, experiment) => {
            acc[experiment.uuid] = {...experiment, active: null}
            return acc
          }, {}))

          return Promise.all(
            experiments.map(({uuid}) => client.isExperimentActive(uuid, context))
          )
        })
        .then((activeStates) => setExperiments(experiments.reduce((acc, experiment, i) => {
          acc[experiment.uuid] = {...experiment, active: activeStates[i]}
          return acc
        }, {})))
        .catch(Function.prototype)
    }
  }, [apiKey, apiUrl, context])

  return <ExperimentContext.Provider value={experiments}>
    {children}
  </ExperimentContext.Provider>
}

ExperimentProvider.defaultProps = {
  context: {},
}

ExperimentProvider.propTypes = {
  apiKey: PropTypes.string,
  apiUrl: PropTypes.string,
  context: PropTypes.oneOfType([
    PropTypes.shape({
    uniqueId: PropTypes.string,
    }),
    PropTypes.string,
  ]),
}

export default ExperimentProvider

