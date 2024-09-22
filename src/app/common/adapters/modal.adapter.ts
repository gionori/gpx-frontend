import Swal from 'sweetalert2'

export interface MessageData {
    title: string;
    message: string;
}


export interface MessageOptions {
    showCancelButton?: boolean;
    cancelButtonText?: string;
    showConfirmButton?: boolean;
    confirmButtonText?: string;
}


export class ModalAdapter {

    static ShowSimpleMessage(data: MessageData): void {
        Swal.fire({
            title: data.title,            
            html: data.message,
            confirmButtonText: 'Aceptar',   
            cancelButtonText: 'Cerrar',    
            showCancelButton: true,
            showConfirmButton: false
        });
    }


    static ShowConfirmDialog(data: MessageData, options: MessageOptions = {}) {
        return Swal.fire({
            title: data.title,
            html: data.message,
            ... options,
            // showCancelButton: true,
            // confirmButtonText: "Save",
            // denyButtonText: `Don't save`
          })
    }

}