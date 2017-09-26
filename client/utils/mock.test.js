
export const createRouterMock = (pathToActionMap, options) => {
  const opt = options || {
    querySerializer: () => {}
  }
  const mock = {
    pathToAction: (pathname) => pathToActionMap[pathname],
    getOptions: () => opt
  }
  return mock
}

export default createRouterMock
