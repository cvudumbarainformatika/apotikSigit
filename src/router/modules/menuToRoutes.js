// src/router/menuToRoutes.js

// const BASE_PATH = '/admin'


// helper untuk resolve komponen berdasarkan view + component



const modules = import.meta.glob('/src/views/**/*.vue');
function resolveComponent(view, component) {
  if (!view || !component) return null;
  // pastikan ada prefix /src
  const normalizedView = view.startsWith('/src')
    ? view
    : `/src${view.startsWith('/') ? view : '/' + view}`;

  const filePath = `${normalizedView}/${component}.vue`;

  return modules[filePath] || null;
}


export function convertMenuToRoutes(items) {
  const routes = []


  items.forEach(item => {
    if (item.children && item.children.length > 0) {
      item.children.forEach(child => {

        const component = resolveComponent(child.view, child.component);

        if (component) {
          routes.push({
            path: normalizePath(child.url),
            // name: child.name || child.url,
            // component: () => import(
            //   /* @vite-ignore */ `${child.view}/${child.component}.vue`
            // ),
            component,
            meta: {
              title: child.title,
              icon: child.icon
            }
          })
        }
      })
    } else  {
      const component = resolveComponent(item?.view, item?.component);
      if (component) {
        routes.push({
          path: normalizePath(item.url),
          // name: item.name || item.url,
          // component: () => import(
          //   /* @vite-ignore */ `${item.view}/${item.component}.vue`
          // ),
          component,
          meta: {
            title: item.title,
            icon: item.icon
          }
        })
      }
    }
  })

  return routes
}

// Helper function to ensure leading slash
function normalizePath(path) {
  return path?.startsWith('/') ? path : '/' + path
}
