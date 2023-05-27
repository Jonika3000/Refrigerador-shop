export interface ICategoryItem {
    id: number,
    name: string, 
    description: string,
    slug:string
} 

export interface ICategoryResponse {
    data: Array<ICategoryItem>,  
    current_page: number,  
    total: number,         
    last_page: number    
}


export interface ICategorySearch {
    page?: number | string | null
}
export interface IItem {
    id: number,
    name: string,
    description: string,
    price: number,
    imagePrev:File|null,
    categoryId: number
} 
export  interface ILogin{
    email:string,
    password:string
}
export interface IRegister {
    email: string,
    password: string,
    name:string,
    number:string,
    photo: File|null,
    surname:string,
    firstname:string
} 