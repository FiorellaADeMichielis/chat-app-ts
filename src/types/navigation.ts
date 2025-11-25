export type AppView = 
  | 'chat'           // Chat
  | 'profile'        // user profile
  | 'settings'       // Settings
  | 'notifications'; // Notifications

export interface NavigationState {
  currentView: AppView;
  previousView: AppView | null;
}