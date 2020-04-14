import {Children} from 'react'

export const isPOJsO = (obj) => Object.prototype.toString.call(obj) === '[object Object]'

export function getChildrenByName(props) {
  const children = Children.toArray(props.children)

  if (Array.isArray(children)) {
    return function(name) {
      return children.filter(isChildOfType(name))
    }
  }

  return []
}

function isChildOfType(ctor) {
  return ctor ? (child) => {
    return child && child.type && child.type.name === ctor.name
  } : () => {
    return false
  }
}