
//Token de Jefe para que esto funcione
var token = JSON.parse(sessionStorage.getItem("token"));
var dianoche = localStorage.getItem("modo");
function cambiamodo(){
    if(dianoche == 0){
        document.body.style.backgroundColor ="#FFF"
        document.getElementById("alltrabajadores").style.backgroundColor = "#A6A5A5";
        document.getElementById("alltrabajadores").style.color = "black";    
    }
    else{
     document.body.style.backgroundColor = "#2C3545";
     document.body.style.color = "#FFF";
     document.getElementById("alltrabajadores").style.backgroundColor = "#FFF";
    }
}

$(document).ready(cambiamodo);

// Mostrar admins
function mostra_admins(){
    let tabla = document.getElementById("admins");
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/api/administrators", true);
    xhttp.setRequestHeader("miclavesecreta", token.token);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let datos = JSON.parse(this.response);
            tabla.innerHTML = ' ';
            for (item of datos){
                tabla.innerHTML+= 
                `
                <tr class="item">
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>${item.job}</td>
                    <td class="columnahidden"> <button type="button" class="eliminame btn btn-danger"> Eliminar </button> <td>
                </tr>` 
            }
            let muestraelimina = document.getElementsByClassName("item");
            let eliminame = document.getElementsByClassName("eliminame");
            let columna = document.getElementsByClassName("columnahidden");
            for(var i= 0; i <muestraelimina.length; ++i){
                let muestralo = $(muestraelimina[i]).children()[3]
                muestraelimina[i].addEventListener("click", function(){
                    comprueba_abiertos(columna, muestralo)
                })
            }
            for(var j= 0; j<eliminame.length; ++j){
                eliminame[j].addEventListener("click", function(){
                    let idelimina = $(this).parent().prev().prev().prev().text()
                    let nombre = $(this).parent().prev().prev().text()
                    let job =  $(this).parent().prev().text()
                    swal({
                        title: "¿Estás seguro de que quieres eliminar a este administrador?"+ " "+ nombre,
                        text: "Esto significa que este administrador ya no trabaja para este aeropuerto",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                      })
                      .then((willDelete) => {
                        if (willDelete) {
                            eliminaTrabajador(idelimina,nombre,job);
                            swal("El administrador ha sido eliminado correctamente", {
                                icon: "success",
                            });
                        }
                      });
                })
            }
        }
        else if(this.readyState == 4 && this.status != 200){
            document.getElementById("alerta").style.display = "block"
        }
    };
}
$(document).ready(mostra_admins)

// Mostrar formulario para añadir trabajador
let abre = function(){
    $("#abre").click(function(ev){
       ev.preventDefault();
       let $element= $(this).parent().next();
       $element.toggle(500)
       document.getElementById("eleccion").style.display = "none";
    })
}

let cierra = function(){
   $("#atras").click(function(ev){
       ev.preventDefault();
       let $element = $(this).parent().parent();
       $element.toggle(500)
       document.getElementById("eleccion").style.display = "block";
       let inps = document.getElementsByClassName("inpts");
       inps[0].value =""
       inps[1].value =""
       inps[2].value =""
       inps[3].value =""
       inps[4].value =""
       inps[5].value ="0"
   })
}

$(document).ready(abre);
$(document).ready(cierra);

// Añadir un trabajador.

function anadirTrabajador() {

    let inputs = document.getElementsByClassName("inpts");
    let x = inputs[5].selectedIndex
    if(inputs[3].value == inputs[4].value && inputs[5].options[x].value != 0){
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", "http://localhost:3000/api/administrators", true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.setRequestHeader("miclavesecreta", token.token);
        xhttp.send(JSON.stringify({
            name: inputs[0].value,
            id: inputs[1].value,
            email: inputs[2].value,
            password: inputs[3].value,
            job: inputs[5].options[x].text
        }));
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(JSON.parse(this.response));
                location.reload();
            }
            else if (this.readyState == 4 && this.status !=200){
                document.getElementById("alerta").style.display ="block";
            }
        };
    }
    else{
        if(inputs[3].value != inputs[4].value){
            inputs[3].value ="";
            inputs[4].value ="";
            alert("Las contraseñas introducidas no coinciden")
        }
        else if(inputs[5].options[x].value == 0){
            alert("Selecciona un trabajo")
        }
    }
};

$(document).ready(function(){
    let anade = document.getElementById("anade");
    anade.addEventListener("click", anadirTrabajador);
});

//Eliminar un trabajador.

function eliminaTrabajador(idadmin, nombre, trabajo) {
    let xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "http://localhost:3000/api/administrators/eliminar", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("miclavesecreta", token.token);
    xhttp.send(JSON.stringify({
        name: nombre,
        id: idadmin,
        job: trabajo
    }))
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            $("#alltrabajadores").load(mostra_admins())
        }
        else if (this.readyState == 4 && this.status !=200){
            document.getElementById("alerta").style.display ="block";
        }
    };
};

// Botones funcionales, clickeas uno y se va el otro.
function comprueba_abiertos(btnshow, muestra){
    if(muestra.style.display =="block"){
        muestra.style.display ="none"
    }
    else{
        for(var i = 0; i < btnshow.length; ++i){
            if(btnshow[i]==muestra){
                btnshow[i].style.display = "block"
            }
            else{
                if(btnshow[i].style.display != "none") btnshow[i].style.display = "none";
            }
        }
    }
    
}
