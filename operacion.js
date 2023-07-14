class Operacion {
    constructor(numeroOrigen, numeroDestino, valor){
        this.numeroOrigen = numeroOrigen;
        this.numeroDestino = numeroDestino;
        this.fecha = new Date().toLocaleDateString();
        this.valor = valor;
    }
}

module.exports = Operacion