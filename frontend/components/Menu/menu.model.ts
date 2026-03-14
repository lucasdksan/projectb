export interface MenuProps {
    email: string;
    name: string;
}

export interface MenuAreaProps {
    profile: {
        name: string;
        email: string;
    };
    isActive: (path: string) => boolean;
};

export const menuItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/dashboard/products", label: "Produtos" },
    { path: "/dashboard/generatedContent", label: "Conteúdos Salvos" },
    { path: "/dashboard/contentAI", label: "Conteúdo IA" },
    { path: "/dashboard/postStudio", label: "Post Studio" },
    { path: "/dashboard/settings", label: "Configurações" },
    { path: "/dashboard/storeConfig", label: "Configurações da Loja" },
  ];

  export const activeStyle = "bg-[#00ff41]/10 text-[#00ff41] border-r-4 border-[#00ff41]";
  export const normalStyle = "text-gray-400 hover:text-white hover:bg-white/5 transition-all";