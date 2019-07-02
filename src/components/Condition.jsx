import React, {PureComponent} from 'react'
import PropTypes from 'prop-types'

import {getChildrenByName} from '../util'

export const If = ({children}) => <>{children}</>
export const ElseIf = ({children}) => <>{children}</>
export const Else = ({children}) => <>{children}</>

If.propTypes = ElseIf.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
  if: PropTypes.any,
}

Else.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
}

export default class Condition extends PureComponent {
  state = {renderChild: null}

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.arrayOf(PropTypes.node),
    ]),
  }

  static defaultProps = {
    children: [],
  }

  constructor(...args) {
    super(...args)

    const getConditionChildren = getChildrenByName(this.props)
    const ifChildren = getConditionChildren('If')

    if (ifChildren.length > 1) {
      throw new Error('More than one If condition found.')
    }

    const [ifChild] = ifChildren

    if (!ifChild) {
      throw new Error('No If block defined.')
    }

    if (typeof getCondition(ifChild) === 'undefined') {
      throw new Error('No If condition defined.')     
    }

    const elseChildren = getConditionChildren('Else')

    if (elseChildren.length > 1) {
      throw new Error('More than one Else block found.')
    }

    const [elseChild] = elseChildren

    if (typeof getCondition(elseChild) !== 'undefined') {
      throw new Error('Else block must not have a condition.')
    }

    const elseIfChildren = getConditionChildren('ElseIf')

    this.state = {
      else: elseChild,
      elseIfs: elseIfChildren,
      if: ifChild,
    }

    if (elseChild) {
      this.state.renderChild = elseChild
    }
  }

  _handleConditional(child) {
    if (!child) debugger
    const condition = getCondition(child)

    return Promise.resolve(typeof condition === 'function' ? condition(this.props) : condition)
      .then((result) => {
        if (result) {
          this.setState({renderChild: child})
        } else {
          const [elseIf, ...elseIfs] = this.state.elseIfs.slice()

          if (elseIf) {
            this.setState({elseIfs})

            return this._handleConditional(elseIf)
          }
        }
      })
      .catch((e) => console.error(e))
  }

  componentDidMount() {
    return this._handleConditional(this.state.if)
  }

  render() {
    if (this.state.renderChild) {
      return this.state.renderChild.props.children
    }

    return null
  }
}



function getCondition(child) {
  return child && child.props && child.props.condition
}
