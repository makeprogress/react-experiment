import PropTypes from 'prop-types'

import {withExperiments} from './withExperiments'
import {getChildrenByName} from '../util'

export const Active = () => null
export const Inactive = () => null

Active.displayName = 'react-experiment/Active'
Inactive.displayName = 'react-experiment/Inactive'

export const Experiment = withExperiments(({
  alwaysRenderInactive,
  children,
  experimentId: uuid,
  experiments,
}) => {
  const experiment = experiments[uuid]
  const getExperimentChildren = getChildrenByName({children})
  const [ActiveChild] = getExperimentChildren(Active.displayName)
  const [InactiveChild] = getExperimentChildren(Inactive.displayName)

  if (!experiment) {
    console.warn('Experiment with id %s not found in provided context. It may not be loaded.', uuid)

    return null
  }

  if (ActiveChild && experiment.active === true) {
    return ActiveChild.props.children
  }

  if (InactiveChild && (experiment.active === false || alwaysRenderInactive)) {
    return InactiveChild.props.children
  }

  return null
})

Experiment.Active = Active
Experiment.Inactive = Inactive

Experiment.defaultProps = {
  alwaysRenderInactive: false,
  context: {},
  experiments: {},
  showErrors: false,
}

Experiment.propTypes = {
  alwaysRenderInactive: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  experimentId: PropTypes.string.isRequired,
  experiments: PropTypes.objectOf(PropTypes.shape({
    active: PropTypes.bool,
    uuid: PropTypes.string,
  })),
}

Experiment.displayName = 'react-experiment/Experiment'

export default Experiment
