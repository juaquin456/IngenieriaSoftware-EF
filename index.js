const express = require("express");
const Cuenta = require("./user");

const app = express();

var BD = [];
BD.push(new Cuenta("21345", "Arnaldo", 200, ["123", "456"]));
BD.push(new Cuenta("123", "Luisa", 400, ["456"]));
BD.push(new Cuenta("456", "Andrea", 300, ["21345"]));

function find(list, usrnum){
    return list.find(usr => usr.numero == usrnum);
}

app.get("/billetera/contactos", (req, res)=>{
    const usr = find(BD, req.query.minumero);
    if(!usr) res.status(400).send({error: "Cuenta no encontrado"});
    else {
        const formated_contacts = usr.contactos.map(contact => {
            const cont = find(BD, contact);
            return {
                numero: cont.numero,
                nombre: cont.nombre
            }
        })
        res.send({contactos: formated_contacts})
    }
})

app.get("/billetera/pagar", (req, res)=>{
    const usr1 = find(BD, req.query.minumero);
    const usr2 = find(BD, req.query.numerodestino);
    const monto = parseInt(req.query.valor);
    if(!usr1 || !usr2 || !monto){
        res.status(400).send({error: "No se recibio todos los parametros"});
        return;
    }
    const operacion = usr1.pagar(usr2, monto);
    if(!operacion){
        res.status(500).send({error: "No se pudo procesar el pago"});
        return;
    }

    res.send({operacion: operacion});
})

app.get("/billetera/historial", (req, res)=>{
    const usr = find(BD, req.query.minumero);
    if (!usr) res.status(400).send({error: "Usuario no encontrado"})
    else res.send({saldo: usr.saldo, hitsorial: usr.historial().map(op => {if(op.numeroDestino == usr.numero) op.estado = "Recibido"; else op.estado = "Enviado"; return op;})})
})

app.listen(5000, ()=>{
    console.log("Listening on port ", 5000)
})