import { Pipe, PipeTransform } from '@angular/core';
import { PERMISSION } from '../models/user';


@Pipe({
    name: 'labelizePermission',
})
export class LabelizePermissionPipe implements PipeTransform {
    transform(value: PERMISSION): string {
        if (value === 'CAN_VIEW_USERS') {
            return 'Ver usuarios'
        } else if (value === 'CAN_CREATE_USERS') {
            return 'Crear usuarios'
        }
        else if (value === 'CAN_REMOVE_USERS') {
            return 'Eliminar usuarios'
        }
        else if (value === 'CAN_VIEW_TRANSACTIONS') {
            return 'Ver transacciones'
        }
        else if (value === 'CAN_VIEW_METRICS') {
            return 'Ver métricas'
        }

        return 'Desconocido'
    }
}
