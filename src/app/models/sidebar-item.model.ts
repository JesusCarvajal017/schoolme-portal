export interface SidebarItem {
  name: string;
  path?: string;   
  orden : number;  
  icon: string;
  formularios?: FormItems[];
}

interface FormItems {
  name: string;
  permission: string;
  path: string;   
  orden: number;  
}






































