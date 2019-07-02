import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'
import boston from '@boston/js'

import Condition, {Else, If} from './Condition'

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

  render() {
    const getExperimentChildren = getChildrenByName(this.props)
    const [Active] = getExperimentChildren('Active')
    const [Inactive] = getExperimentChildren('Inactive')
    const contextIsPOJsO = Object.prototype.toString.call(this.props.context) === '[object Object]'
    const context = contextIsPOJsO ? this.props.context : {uniqueId: this.props.context}

    return <>
      {this.props.showErrors && this.state.error && <div>{this.state.error}</div>}
      <Condition>
        {Active && <If 
          condition={() => this.boston.isExperimentActive(this.props.experimentId, context)}>
          {Active.props.children}
        </If>}
        {Active && Inactive && <Else>{Inactive.props.children}</Else>}
        {!Active && Inactive && <If condition={true}>{Inactive.props.children}</If>}
      </Condition>
    </>
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
