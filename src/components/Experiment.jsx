import PropTypes from 'prop-types'

import {getChildrenByName} from '../util'
import {withExperiments} from './withExperiments'

export const Active = () => null
export const Inactive = () => null

export const Experiment = withExperiments(({children, experimentId, experiments}) => {
  const experiment = experiments.find(({uuid}) => uuid === experimentId)
  const getExperimentChildren = getChildrenByName({children})
  const [ActiveChild] = getExperimentChildren(Active)
  const [InactiveChild] = getExperimentChildren(Inactive)

  if (!experiment) {
    console.error(
      'Experiment with id %s not found in provided context.',
      experimentId,
    )

    return null
  }

  if (this.state.active === true && ActiveChild) {
    return ActiveChild.props.children
  }

  if (
    InactiveChild &&
    (this.state.active === false || this.props.alwaysRenderInactive)
  ) {
    return InactiveChild.props.children
  }

  return null
})

Experiment.Active = Active
Experiment.Inactive = Inactive

Experiment.propTypes = {
  alwaysRenderInactive: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  experimentId: PropTypes.string.isRequired,
  experiments: PropTypes.arrayOf(PropTypes.shape({
    active: PropTypes.bool,
  })),
}

Experiment.defaultProps = {
  alwaysRenderInactive: false,
  context: {},
  showErrors: false,
}

export default Experiment

