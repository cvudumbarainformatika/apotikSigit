export function convertMenusToHeader(menuItems) {
  return menuItems.map(menu => {
    const submenu = (menu.children || []).map(child => ({
      name: child.name,
      label: child.title,
      url: ensureLeadingSlash(child.url),
    }))

    return {
      name: menu.name || menu.url,
      label: menu.title,
      url: ensureLeadingSlash(menu.url || (submenu[0]?.url ?? '/')),
      submenu
    }
  })
}

function ensureLeadingSlash(path) {
  if (!path) return '/'
  return path.startsWith('/') ? path : '/' + path
}
