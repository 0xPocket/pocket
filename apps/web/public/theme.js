;(function initTheme() {
  var theme = (localStorage.getItem('dark') === 'true' || window.matchMedia("(prefers-color-scheme: dark)").matches) ? 'dark' : 'light'
  if (theme === 'dark' && localStorage.getItem('dark') === 'true') {
		console.log(theme);
    document.querySelector('html').classList.add('dark')
  }
})()