import {Children} from 'react'

export const isPOJsO = (obj) => Object.prototype.toString.call(obj) === '[object Object]'

export function getChildrenByName(props) {
  const children = Children.toArray(props.children)

  if (Array.isArray(children)) {
    return function(displayName) {
      return children.filter(isChildOfType(displayName))
    }
  }

  return []
}

export function isChildOfType(displayName) {
  return function({type}) {
    return type && type.displayName && type.displayName === displayName
  }
}
