import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import boston from '@boston/js'

import {getChildrenByName} from '../util'

export const Active = ({children}) => <>{children}</>
export const Inactive = ({children}) => <>{children}</>

Active.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
}

Inactive.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
}

export default class Experiment extends PureComponent {
  state = {}

  static propTypes = {
    alwaysRenderInactive: PropTypes.bool,
    apiKey: PropTypes.string,
    apiUrl: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node),
    ]),
    context: PropTypes.oneOfType([
      PropTypes.shape({
        uniqueId: PropTypes.string,
      }),
      PropTypes.string,
    ]),
    experimentId: PropTypes.string.isRequired,
    showErrors: PropTypes.bool,
  }

  static defaultProps = {
    alwaysRenderInactive: false,
    context: {},
    showErrors: false,
  }

  constructor(...args) {
    super(...args)
    this.boston = boston.createExperimentClient({
      apiKey: this.props.apiKey,
      apiUrl: this.props.apiUrl,
    })
  }

  componentDidMount() {
    const contextIsPOJsO = Object.prototype.toString.call(this.props.context) === '[object Object]'
    const context = contextIsPOJsO ? this.props.context : {uniqueId: this.props.context}

    return this.boston.isExperimentActive(this.props.experimentId, context)
      .then((active) => this.setState({active}))
      .catch((e) => this.setState({error: e.message}))
  }

  render() {
    const getExperimentChildren = getChildrenByName(this.props)
    const [Active] = getExperimentChildren('Active')
    const [Inactive] = getExperimentChildren('Inactive')

    if (this.props.showErrors && this.state.error) {
      return <div>{this.state.error}</div>
    }

    if (this.state.active === true && Active) {
      return Active.props.children
    }

    if (
      (this.state.active === false && Inactive) ||
      (this.props.alwaysRenderInactive && Inactive)
    ) {
      return Inactive.props.children
    }

    return null
  }

  static getDerivedStateFromError(e) {
    return {
      active: false,
      error: e.message,
    }
  }

  static get Active() {
    return Active
  }

  static get Inactive() {
    return Inactive
  }
}
