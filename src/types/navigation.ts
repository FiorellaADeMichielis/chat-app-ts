export type AppView = 
  | 'chat'           
  | 'profile'        
  | 'settings'       
  | 'notifications'; 

export interface NavigationState {
  currentView: AppView;
  previousView: AppView | null;
}