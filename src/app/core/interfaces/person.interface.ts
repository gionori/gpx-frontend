export interface Person {
    id?: number | null;
    name: string;
    paternal: string;
    maternal: string;
    address: string;
    phone: string;
    isDeleted?: boolean;
}