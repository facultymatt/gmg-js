module.exports = jest.fn(() => ({
  put: () => {
    return new Promise(() => true)
  },
  allDocs: () => {
    return new Promise(() => true)
  },
}));
