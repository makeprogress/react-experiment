import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import boston from '@boston/js'

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
    children: [],
    context: {},
    showErrors: false,
  }

  constructor(...args) {
    super(...args)
    this.boston = boston.createExperimentClient({
      apiKey: this.props.apiKey,
      apiUrl: this.props.apiUrl,
    })

    const contextIsPOJsO = Object.prototype.toString.call(this.props.context) === '[object Object]'
    const context = contextIsPOJsO ? this.props.context : {uniqueId: this.props.context}

    this.boston.isExperimentActive(this.props.experimentId, context)
      .then((active) => this.setState({active}))
      .catch((e) => this.setState({
        active: false,
        error: e.message,
      }))
  }

  render() {
    const children = Array.isArray(this.props.children) ? this.props.children : [this.props.children]

    return <>
      {this.props.showErrors && this.state.error && <div>{this.state.error}</div>}
      {this.state.active && children.filter(({type}) => type && type.name === 'Active')}
      {!this.state.active && children.filter(({type}) => type && type.name === 'Inactive')}
    </>
  }

  static get Active() {
    return Active
  }

  static get Inactive() {
    return Inactive
  }
}
