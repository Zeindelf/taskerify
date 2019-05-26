// Custom example code
document
  .getElementById('#app')
  .appendChild(document.createElement('h1'))
  .innerHTML = 'Hello, World!'
    .split('')
    .map(value => `<span>${value}</span>`)
    .join('');
