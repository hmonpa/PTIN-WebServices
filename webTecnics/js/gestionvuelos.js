
moment.locale("es")

// Variables importantes
// Día de hoy
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();

today = `${dd}/${mm}/${yyyy}`;

// Selección de año
let selector = document.getElementById("selectyear");
selector.innerHTML+= `<option value="1">${yyyy}</option>
<option value="2">${yyyy+1}</option>`


// Hora actual
var date, hour, minutes, hora_actual;

//Traer trajetas de embarque de la base de datos
var tarjetas_embarque = []
function traer_tarjetas (){
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/api/boarding_passes", true);
    xhttp.setRequestHeader("miclavesecreta", token.token);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200 ){
            tarjetas_embarque = JSON.parse(this.response)
        }
    }
}

// Enseñar la parte de añadir vuelo
 let abre = function(){ 
     $("#abre").click(function(ev){
        ev.preventDefault();
        let $element= $(this).parent().prev().prev();
        $element.toggle(500)
        setTimeout(function(){
            window.scrollTo(0,$(document).height())
        }, 500)
        document.getElementById("modif").style.display = "none";
        document.getElementById("abre").style.display = "none";
        document.getElementById("elimina2").style.display = "none";
     })
 }

 let cierra = function(){
    $("#atras").click(function(ev){
        ev.preventDefault();
        let $element= $(this).parent().parent();
        $element.toggle(500)
        document.getElementById("modif").style.display = "block";
        document.getElementById("abre").style.display = "block";
        document.getElementById("elimina2").style.display = "block";
        document.getElementById("alerta2").style.display ="none";
        document.getElementById("alerta3").style.display ="none";
        document.getElementById("alerta4").style.display ="none";
        let inputs = document.getElementsByClassName("inpts");
        let aerolinea = document.getElementById("selectair");
        let fecha = document.getElementsByClassName("fecha");
        inputs[0].value ="";
        inputs[1].value="";
        inputs[2].value="";
        inputs[3].value="";
        inputs[4].value="";
        inputs[5].value ="";
        inputs[6].value="";
        inputs[7].value="";
        inputs[8].value="";
        aerolinea.value="0";
        fecha[0].value ="13";
        fecha[1].value = "13";
        fecha[2].value = "31";
    })
 }
 
 $(document).ready(abre);
 $(document).ready(cierra);

// Enseñar la parte de eliminar vuelo
let abre4 = function(){
    $("#elimina2").click(function(ev){
       ev.preventDefault();
       let $element= $(this).parent().prev();
       $element.toggle(500)
       setTimeout(function(){
            window.scrollTo(0,$(document).height())
        }, 500)
       document.getElementById("modif").style.display = "none";
       document.getElementById("abre").style.display = "none";
       document.getElementById("elimina2").style.display = "none";
    })
}

let cierra4 = function(){
   $("#atras4").click(function(ev){
       ev.preventDefault();
       let $element= $(this).parent().parent();
       $element.toggle(500)
       document.getElementById("modif").style.display = "block";
       document.getElementById("abre").style.display = "block";
       document.getElementById("elimina2").style.display = "block";
       document.getElementById("alerta2").style.display ="none";
       let inps = document.getElementById("inpts3");
       inps.value=""
   })
}

$(document).ready(abre4);
$(document).ready(cierra4);

// Rellenar la tabla desde la bbdd
var infovuelos, horas_embarque
function traerDatos() {
    traer_tarjetas();
    setTimeout(function(){
        horas_embarque = []
        var tabla = document.getElementById("contenido");
        var passvuelos, seatvuelos, i;
        let ready = new Boolean(false)
        let xhttp = new XMLHttpRequest();
        xhttp.open("GET", "http://localhost:3000/api/flights", true);
        xhttp.send();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200 ){
                infovuelos = JSON.parse(this.response);
                tabla.innerHTML = ' ';
                i = 0;
                for (item of infovuelos){
                    if(item.state == "En hora"){
                        tabla.innerHTML+= `
                        <tr class="enhora elemvuelo">
                            <td>${item.name}</td>
                            <td>${item.airline}</td>
                            <td>
                                <select class="modificacionavi decorated custom-select"> 
                                    <option value="1" selected>En hora</option>
                                    <option value="2">Cancelado</option>
                                    <option value="3">Con retraso</option>
                                </select>
                            </td>
                            <td>${item.type}</td>
                            <td>${moment(item.boarding_time).format('LT')}</td>
                            <td>${item.departure_time}</td>
                            <td>${item.arrival_time}</td>
                            <td>${item.gate.name}</td>
                        </tr>
                        <tr class ="tarjetas" style="display:none;text-align:center;">
                            <td id= "pasajeros${i}" colspan= "4"></td>
                            <td id= "asientos${i}" colspan= "4"></td>
                        </tr>
                        `
                    }
                    if(item.state == "Cancelado"){
                        tabla.innerHTML+= `
                        <tr class="cancelado elemvuelo">
                            <td>${item.name}</td>
                            <td>${item.airline}</td>
                            <td>
                                <select class="modificacionavi decorated custom-select"> 
                                    <option value="1">En hora</option>
                                    <option value="2" selected>Cancelado</option>
                                    <option value="3">Con retraso</option>
                                </select>
                            </td>
                            <td>${item.type}</td>
                            <td>${moment(item.boarding_time).format('LT')}</td>
                            <td>${item.departure_time}</td>
                            <td>${item.arrival_time}</td>
                            <td>${item.gate.name}</td>
                        </tr>
                        <tr class ="tarjetas" style="display:none;text-align:center;">
                            <td id= "pasajeros${i}" colspan= "4"></td>
                            <td id= "asientos${i}" colspan= "4"></td>
                        </tr>
                        `
                    }
                    if(item.state == "Con retraso"){
                        tabla.innerHTML+= `
                        <tr class="conretraso elemvuelo">
                            <td>${item.name}</td>
                            <td>${item.airline}</td>
                            <td>
                                <select class="modificacionavi decorated custom-select"> 
                                    <option value="1">En hora</option>
                                    <option value="2">Cancelado</option>
                                    <option value="3" selected>Con retraso</option>
                                </select>
                            </td>
                            <td>${item.type}</td>
                            <td>${moment(item.boarding_time).format('LT')}</td>
                            <td>${item.departure_time}</td>
                            <td>${item.arrival_time}</td>
                            <td>${item.gate.name}</td>
                        </tr>
                        <tr class ="tarjetas" style="display:none;text-align:center;">
                            <td id= "pasajeros${i}" colspan= "4"></td>
                            <td id= "asientos${i}" colspan= "4"></td>
                        </tr>
                        `
                    }
                    passvuelos = document.getElementById("pasajeros"+ i);
                    seatvuelos = document.getElementById("asientos"+ i);
                    passvuelos.innerHTML+= ' '
                    seatvuelos.innerHTML+= ' '
                    let mismo_vuelo = [];
                    for(var x = 0; x < tarjetas_embarque.length; ++x){
                        if(tarjetas_embarque[x].flights == item.name){
                            let pasajeroenvuelo = {
                                name: tarjetas_embarque[x].name_passenger,
                                seat: tarjetas_embarque[x].seat
                            }
                            mismo_vuelo.push(pasajeroenvuelo)
                        } 
                    }
                    if(mismo_vuelo.length == 0){
                        passvuelos.innerHTML+= `<p> Este vuelo no tiene pasajeros</p>`
                        passvuelos.setAttribute("colspan", "7");
                    }
                    else{
                        for(var a = 0; a < mismo_vuelo.length ; ++a){
                            passvuelos.innerHTML+= `<p> Pasajero: ${mismo_vuelo[a].name}</p><br>`
                            seatvuelos.innerHTML+= `<p> Asiento: ${mismo_vuelo[a].seat}</p><br>`
                        }
                    }
                    ++i;
                }
                //Enseñar los pasajeros de un vuelo
                
                let ensenaasientos = document.getElementsByClassName("elemvuelo");
                for(var b= 0; b<ensenaasientos.length; ++b){
                    ensenaasientos[b].addEventListener("click", function(event){
                        let exc = event.target;
                        if(!exc.classList.contains("modificacionavi")) $(this.nextElementSibling).toggle("fast");
                    })
                }

                //Vuelos que mandarán aviso en caso de día de hoy
                for(var i = 0; i<infovuelos.length; ++i){
                    if(infovuelos[i].state == "En hora" && moment(infovuelos[i].date).format('DD/MM/YYYY') == today){
                        let aux = {
                            name: infovuelos[i].name,
                            boarding_time:infovuelos[i].boarding_time,
                            bool: new Boolean(false),
                            abierta: new Boolean(false)
                        }
                        horas_embarque.push(aux)
                    }
                }
                comprobar_hora(horas_embarque);
            }
        }
    },500)
    
};

$(document).ready(traerDatos);


// Comprobación de la hora.
function comprobar_hora(h){
    setInterval(function(){
        date = new Date()
        hour = date.getHours();
        minutes = date.getMinutes();
        hora_actual = new Date(yyyy, mm-1, dd, hour, minutes);
        for(var i = 0; i<h.length; ++i){
            let h1 = new Date(h[i].boarding_time);
            let h2 = new Date(hora_actual);
            if(h1>h2){
                let diferencia = Math.abs(h1.getMinutes()-h2.getMinutes())
                if(diferencia<=10 && h[i].bool == false){
                    h[i].bool = true;
                    mandar_aviso_enhora(h[i].name, diferencia);
                }
                else if(Math.abs(diferencia) >= 50 && h[i].bool == false){
                    h[i].bool = true;
                    mandar_aviso_enhora(h[i].name, 10-Math.abs(50-diferencia));
                }
            }
            else if((h1.getHours == h2.getHours) && (h1.getMinutes == h2.getMinutes) && h[i].abierta == false){
                h[i].abierta = true,
                mandar_aviso_enhora(h[i].name, 0);
            }
        }
    }, 5000)
}

// Enviar avisos a pasajeros de boarding
function mandar_aviso_enhora(vuelo, tiempo){
    let date2 = new Date()
    let hour2 = date2.getHours();
    let minutes2 = date2.getMinutes();
    let fecha_notificacion = new Date(yyyy, mm-1, dd, hour2, minutes2);
    let xhttp = new XMLHttpRequest;
    xhttp.open("PUT", "http://localhost:3000/api/passengersAds", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    if(tiempo == 0){
        xhttp.send(JSON.stringify({
            name : vuelo,
            notices: {
                id: 1,
                notification: "Se han abierto las puertas de embarque",
                date: fecha_notificacion
            }
        }));
    }
    else{
        xhttp.send(JSON.stringify({
            name : vuelo,
            notices: {
                id: 0,
                notification: `La puerta de embarque se abre en ${tiempo} minutos.`,
                date: fecha_notificacion
            }
        }));
    }
}

function mandar_aviso(vuelo, state){
    let date2 = new Date()
    let hour2 = date2.getHours();
    let minutes2 = date2.getMinutes();
    let fecha_notificacion = new Date(yyyy, mm-1, dd, hour2, minutes2);
    let xhttp = new XMLHttpRequest;
    xhttp.open("PUT", "http://localhost:3000/api/passengersAds", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    if(state == "Con retraso"){
        xhttp.send(JSON.stringify({
            name : vuelo,
            notices: {
                id: 3,
                notification: "El vuelo se ha retrasado",
                date: fecha_notificacion
            }
        }));
    }
    else if(state == "Cancelado"){
        xhttp.send(JSON.stringify({
            name : vuelo,
            notices: {
                id: 2,
                notification: "El vuelo se ha cancelado",
                date: fecha_notificacion
            }
        }));
    }
}

// Modificar vuelos
function modificavuelo(vola){
    for(var i= 0; i<vola.length; ++i){
        let xhttp = new XMLHttpRequest();
        xhttp.open("PUT", "http://localhost:3000/api/flights", true);
        xhttp.setRequestHeader("miclavesecreta", token.token);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify({
            name : vola[i].name,
            state: vola[i].state
        }));
        let estado = vola[i].state
        let nombre_vuelo = vola[i].name
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200 ) {
                if(estado == "Con retraso") mandar_aviso(nombre_vuelo, estado);
                else if(estado == "Cancelado") mandar_aviso(nombre_vuelo,estado);
                $("#tablavuelos").load(traerDatos());
            }
            else if(this.readyState == 4 && this.status == 403){
                document.getElementById("alertaautent3").style.display ="block";
            }
        }
    }
}

$(document).ready(function(){
    document.getElementById("modif").addEventListener("click", function(){
        const vola = document.getElementsByClassName("modificacionavi");
        let cambia = 0;
        let idvuelo = [];
        let nombresvuelos = []
        let i = 0;
        for(item of infovuelos){
            let x = vola[i].selectedIndex
            if(vola[i].options[x].text != item.state){
                let envia = {
                    name: item.name,
                    state: vola[i].options[x].text
                }
                idvuelo.push(envia);
                nombresvuelos.push(item.name)
                cambia = 1;
            }
            ++i;
        }
        if(cambia){
            if(nombresvuelos.length == 1){
                swal({
                    title: "¿Estás seguro que quieres modificar el estado de este vuelo?"+ " "+ nombresvuelos[0],
                    icon: "warning",
                    buttons: true,
                  })
                  .then((willDelete) => {
                    if (willDelete) {
                        modificavuelo(idvuelo);
                        swal("El estado del vuelo se ha modificado correctamente", {
                            icon: "success",
                        });
                    }
                    else{
                        $("#tablavuelos").load(traerDatos());
                    }
                  });
            }
            else{
                swal({
                    title: "¿Estás seguro que quieres modificar el estado de estos vuelos?"+ " "+ nombresvuelos.join(","),
                    icon: "warning",
                    buttons: true,
                  })
                  .then((willDelete) => {
                    if (willDelete) {
                        modificavuelo(idvuelo);
                        swal("El estado de los respectivos vuelos se han modificado correctamente", {
                            icon: "success",
                        });
                    }
                    else{
                        $("#tablavuelos").load(traerDatos());
                    }
                  });
            }
        }
    });
});

// Añadir vuelos a la base de datos
function anadir() {
    let inputs = document.getElementsByClassName("inpts");
    let fecha = document.getElementsByClassName("fecha");
    let aerolinea = document.getElementById("selectair");
    let aux = aerolinea.selectedIndex;
    let aerolinea_definitiva = aerolinea.options[aux].text;
    let x1 = fecha[0].selectedIndex;
    let x2 = fecha[1].selectedIndex;
    let x3 = fecha[2].selectedIndex;
    let fecha_final = `${fecha[0].options[x1].text}-${fecha[1].options[x2].text}-${fecha[2].options[x3].text}`
    let horaemb = new Date(fecha[0].options[x1].text,x2-1,x3, inputs[5].value[0]+inputs[5].value[1], inputs[5].value[3]+inputs[5].value[4])
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3000/api/flights", true);
    xhttp.setRequestHeader("miclavesecreta", token.token);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({
        name: inputs[0].value,
        airline: aerolinea_definitiva,
        from: inputs[1].value,
        to: inputs[2].value,
        departure_time: inputs[3].value,
        arrival_time: inputs[4].value,
        boarding_time: horaemb,
        date: fecha_final,
        gate:{
            name: inputs[6].value,
            location_x: inputs[7].value,
            location_y:inputs[8].value
        },
    }));
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200 ) {
            inputs[0].value ="";
            inputs[1].value="";
            inputs[2].value="";
            inputs[3].value="";
            inputs[4].value="";
            inputs[5].value ="";
            inputs[6].value="";
            inputs[7].value="";
            inputs[8].value="";
            aerolinea.value="0"
            fecha[0].value ="13";
            fecha[1].value = "13";
            fecha[2].value = "31"
            let form = document.getElementById("formvuelos")
            $(form).toggle(500)
            document.getElementById("modif").style.display = "block";
            document.getElementById("abre").style.display = "block";
            document.getElementById("elimina2").style.display = "block";
            document.getElementById("alerta2").style.display ="none";
            document.getElementById("alerta3").style.display ="none";
            document.getElementById("alerta4").style.display ="none";
            document.getElementById("filtrovuelos").value="0";
            $("#tablavuelos").load(traerDatos());
        }
        else if(this.readyState == 4 && this.status == 403){
            document.getElementById("alertaautent3").style.display ="block";
        }
        else if(this.readyState == 4 && this.status == 500){
            document.getElementById("alerta2").style.display ="block";
        }
        else if(this.readyState == 4 && this.status == 404){
            document.getElementById("alerta4").style.display ="block";
        }
    };
};

$(document).ready(function(){
    var anade = document.getElementById("anade");
    anade.addEventListener("click", anadir);
});

// Eliminar vuelos
function eliminarvuelos() {

    var inputs4 = document.getElementById("inpts4");
    
    let xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "http://localhost:3000/api/flights", true);
    xhttp.setRequestHeader("miclavesecreta", token.token);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({
        name: inputs4.value
    }));
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200 ) {
            const elimina = horas_embarque.findIndex(function(item,i){
                return item.name==inputs4.value
            })
            if(elimina!=-1) horas_embarque.splice(elimina, 1)
            swal("El vuelo se ha eliminado correctamente", {
                icon: "success",
            });
            inputs4.value =""
            $(document.getElementById("formeliminarvuelo")).toggle(500)
            document.getElementById("modif").style.display = "block";
            document.getElementById("abre").style.display = "block";
            document.getElementById("elimina2").style.display = "block";
            document.getElementById("alerta2").style.display ="none";
            $("#tablavuelos").load(traerDatos());
        }
        else if(this.readyState == 4 && this.status != 200 ){
            document.getElementById("alerta2").style.display ="block";
        }
        else if(this.readyState == 4 && this.status == 403){
            document.getElementById("alertaautent1").style.display ="block";
        }
    };
};

$(document).ready(function(){
    var elimina2 = document.getElementById("elimina3");
    elimina2.addEventListener("click", function(){
        swal({
            title: "¿Estás seguro que quieres eliminar este vuelo?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                eliminarvuelos();
            }
          });
    });
});

// Filtro vuelos
function cambia_vuelos(){
    let enhora= document.getElementsByClassName("enhora");
    let cancelado = document.getElementsByClassName("cancelado");
    let conretraso = document.getElementsByClassName("conretraso");
    let select= document.getElementById("filtrovuelos");
    let x = select.selectedIndex;
    if(select.options[x].text== "Cancelado"){
        for(var i =0 ; i<cancelado.length; ++i){
            cancelado[i].style.display =""
        }
        for(var i =0 ; i<enhora.length; ++i){
            enhora[i].style.display ="none"
        }
        for(var i =0 ; i<conretraso.length; ++i){
            conretraso[i].style.display ="none"
        }
    }
    else if(select.options[x].text== "En hora"){
        for(var i =0 ; i<cancelado.length; ++i){
            cancelado[i].style.display ="none"
        }
        for(var i =0 ; i<enhora.length; ++i){
            enhora[i].style.display =""
        }
        for(var i =0 ; i<conretraso.length; ++i){
            conretraso[i].style.display ="none"
        }
    }
    else if(select.options[x].text== "Con retraso"){
        for(var i =0 ; i<cancelado.length; ++i){
            cancelado[i].style.display ="none"
        }
        for(var i =0 ; i<enhora.length; ++i){
            enhora[i].style.display ="none"
        }
        for(var i =0 ; i<conretraso.length; ++i){
            conretraso[i].style.display =""
        }
    }
    else if(select.options[x].text== "Todos"){
        for(var i =0 ; i<cancelado.length; ++i){
            cancelado[i].style.display =""
        }
        for(var i =0 ; i<enhora.length; ++i){
            enhora[i].style.display =""
        }
        for(var i =0 ; i<conretraso.length; ++i){
            conretraso[i].style.display =""
        }
    }
}

$(document).ready(function(){
    let botonfiltro = document.getElementById("cambiavuelos");
    botonfiltro.addEventListener("click", cambia_vuelos);
})
