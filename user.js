const Operacion =  require("./operacion")

class Cuenta {
    constructor(numero, nombre, saldo, contactos){
        this.numero = numero;
        this.nombre = nombre;
        this.saldo = saldo;
        this.contactos = contactos;
        this._historial = []
    }

    historial(){
        return this._historial;
    }

    pagar(destino, valor){
        const usr = this.contactos.find(usr => usr == destino.numero);
        if (!usr || valor > this.saldo) return null;
        const op = new Operacion(this.numero, destino.numero, valor);
        this.saldo -= valor;
        this._historial.push(op);
        destino.saldo += valor;
        destino._historial.push(op);
        return op;
    }
}

module.exports = Cuenta