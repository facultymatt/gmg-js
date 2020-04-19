module.exports = jest.fn(() => ({
  put: () => {
    return new Promise(() => true)
  },
}));
