import type { RouteLocationNormalized, RouteLocationRaw, RouteRecordName } from 'vue-router';

function hasQuery(routeRecord: RouteLocationNormalized) {
  return !!Object.keys(routeRecord.query).length;
}

export function setFromRedirect(to: RouteLocationNormalized, from: RouteLocationNormalized): RouteLocationRaw | undefined {
  if (!hasQuery(to))
    return { name: to.name as RouteRecordName, query: { redirect: from.fullPath }, hash: from.hash, replace: true };

  // else if (from.name === to.name && hasQuery(from)) {
  //   return { name: to.name, query: from.query, hash: from.hash, replace: true };
  // }
}

// export function redirectOnRefreshPage(to, from) {
//   if (!from.name && !to.redirectedFrom) {
//     return { name: DEFAULT_LOGGED_IN_ROUTE_NAME };
//   }
// }
