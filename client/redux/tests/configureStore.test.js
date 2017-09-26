import configureStore from '../configureStore'

describe('configureStore', () => {
  let store

  beforeAll(() => {
    store = configureStore()
  })

  describe('asyncReducers', () => {
    it('should contain an object for async reducers', () => {
      expect(typeof store.asyncReducers).toBe('object')
    })
  })
})
