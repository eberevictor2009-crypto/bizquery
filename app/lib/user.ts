// app/lib/user.ts
export function getUserId() {
  if (typeof window === 'undefined') return 'server-user';
  
  let userId = localStorage.getItem('bizquery_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('bizquery_user_id', userId);
  }
  return userId;
}