export function getChildrenByName({children}) {
  if (Array.isArray(children)) {
    return function(name) {
      return children.filter(isChildOfType(name))
    }
  }

  if (Object.prototype.toString.call(children) === '[object Object]') {
    return function(name) {
      return [children].filter(isChildOfType(name))
    }
  }

  return []
}

function isChildOfType(name) {
  return function(child) {
    return child && child.type && child.type.name === name
  }
}