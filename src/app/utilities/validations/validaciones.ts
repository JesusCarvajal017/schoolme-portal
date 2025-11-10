import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function AddressValid(): ValidatorFn{
    return (control: AbstractControl) : ValidationErrors | null => {
        // const valor = <string>control.value;

        const valor = control.value as string;

        if (!valor) return null; // no validar si está vacío (eso lo hace required)

        // Regex: soporta "Calle", "Cra", "Carrera", "Cl", "Av", "Transversal"
        const regex = /^(Calle|Cra|Carrera|Cl|Av|Avenida|Transversal)\s+\d+[A-Za-z]?\s*#\s*\d+[A-Za-z]?-?\d*$/i;

        return regex.test(valor)
                ? null
                : { addressInvalid: {
                        message : "Formato inválido. Ejemplos: 'Cra 15 # 85-24', 'Calle 100 # 8A-55'."
                    }
                    };

    }
}