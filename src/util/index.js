/**
 * 工具函数库
 * functional tool library
 */
export const print = (x) => {
  console.log(x)
}

export const existy = (x) => {
  return x != null
}

export const truthy = (x) => {
  return x !== false && existy(x)
}
