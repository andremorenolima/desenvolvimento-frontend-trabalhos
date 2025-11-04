const applyMasks = () => {
    const masks = {
        cpf: '000.000.000-00',
        tel: '(00) 00000-0000',
        cep: '00000-000'
    };

    const inputCPF = document.getElementById('cpf');
    const inputTel = document.getElementById('telefone');
    const inputCEP = document.getElementById('cep');

    if (inputCPF) {
        inputCPF.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/^(\d{3})(\d)/, '$1.$2');
            value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
            value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
            e.target.value = value.substring(0, masks.cpf.length);
        });
    }

    if (inputTel) {
        inputTel.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            value = value.replace(/(\d)(\d{4})$/, '$1-$2');
            e.target.value = value.substring(0, masks.tel.length);
        });
    }

    if (inputCEP) {
        inputCEP.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/^(\d{5})(\d)/, '$1-$2');
            e.target.value = value.substring(0, masks.cep.length);
        });
    }
};

const setupFormValidation = () => {
    const form = document.querySelector('form');
    if (!form) return;

    const inputs = form.querySelectorAll('input[required]');

    const checkValidity = (input) => {
        if (input.validity.patternMismatch) {
            input.setCustomValidity("Preencha o campo no formato correto.");
        } else if (input.validity.valueMissing) {
            input.setCustomValidity("Este campo é obrigatório.");
        } else {
            input.setCustomValidity("");
        }
        
        if (input.checkValidity()) {
            input.classList.remove('is-invalid');
        } else {
            input.classList.add('is-invalid');
        }
    };

    inputs.forEach(input => {
        input.addEventListener('input', () => checkValidity(input));
        input.addEventListener('invalid', () => checkValidity(input));
    });

    form.addEventListener('submit', (e) => {
        let formIsValid = true;
        inputs.forEach(input => {
            checkValidity(input);
            if (!input.checkValidity()) {
                formIsValid = false;
            }
        });

        if (!formIsValid) {
            e.preventDefault();
            const firstInvalid = form.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.focus();
            }
        }
    });
};

export { applyMasks, setupFormValidation };