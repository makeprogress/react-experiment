import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'

import toggles from '@toggles/experiments'

console.log(toggles.createExperimentClient)

import {getChildrenByName} from '../util'

export const Active = () => null
export const Inactive = () => null

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
    this.toggles = toggles.createExperimentClient({
      apiKey: this.props.apiKey,
      apiUrl: this.props.apiUrl,
    })
  }

  componentDidMount() {
    const contextIsPOJsO = Object.prototype.toString.call(this.props.context) === '[object Object]'
    const context = contextIsPOJsO ? this.props.context : {uniqueId: this.props.context}

    return this.toggles.isExperimentActive(this.props.experimentId, context)
      .then((active) => this.setState({active}))
      .catch((e) => this.setState({error: e.message}))
  }

  render() {
    const getExperimentChildren = getChildrenByName(this.props)
    const [ActiveChild] = getExperimentChildren(Active)
    const [InactiveChild] = getExperimentChildren(Inactive)

    if (this.props.showErrors && this.state.error) {
      return <div>{this.state.error}</div>
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
