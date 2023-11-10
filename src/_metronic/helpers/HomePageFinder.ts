export const finder = (role: string | undefined) => {
  switch (role) {
    case 'admin':
      return '/users/user-management/users'
    case 'user':
      return '/articles/article-management/articles'
    case 'executive':
      return '/users/user-management/users'
    case 'referee':
      return '/articles/article-management/articles'
    case 'scientific':
      return '/articles/articlecategories-management/articlecategories'
    default:
      return '/auth'
  }
}
