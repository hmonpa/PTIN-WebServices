
// Enseñar la parte de añadir coche
let abre2 = function(){
    $("#abre2").click(function(ev){
       ev.preventDefault();
       let $element= $(this).parent().prev().prev();
       $element.toggle(500)
       setTimeout(function(){
        window.scrollTo(0,$(document).height())
        }, 500)
       document.getElementById("modif2").style.display = "none";
       document.getElementById("abre2").style.display = "none";
       document.getElementById("elimina").style.display = "none";
    })
}

let cierra2 = function(){
   $("#atras2").click(function(ev){
       ev.preventDefault();
       let $element= $(this).parent().parent();
       $element.toggle(500)
       document.getElementById("modif2").style.display = "block";
       document.getElementById("abre2").style.display = "block";
       document.getElementById("elimina").style.display = "block";
       document.getElementById("alerta").style.display ="none";
       let inps = document.getElementsByClassName("inpts2");
       for(item of inps){
            item.value ="";
       }
   })
}

$(document).ready(abre2);
$(document).ready(cierra2);

// Enseñar la parte de eliminar coche
let abre3 = function(){
    $("#elimina").click(function(ev){
       ev.preventDefault();
       let $element= $(this).parent().prev();
       $element.toggle(500)
       setTimeout(function(){
            window.scrollTo(0,$(document).height())
        }, 500)
       document.getElementById("modif2").style.display = "none";
       document.getElementById("abre2").style.display = "none";
       document.getElementById("elimina").style.display = "none";
    })
}

let cierra3 = function(){
   $("#atras3").click(function(ev){
       ev.preventDefault();
       let $element= $(this).parent().parent();
       $element.toggle(500)
       document.getElementById("modif2").style.display = "block";
       document.getElementById("abre2").style.display = "block";
       document.getElementById("elimina").style.display = "block";
       document.getElementById("alerta").style.display ="none";
       let inps = document.getElementById("inpts3");
       inps.value=""
   })
}

$(document).ready(abre3);
$(document).ready(cierra3);

// Traer datos de la API
var info
function traerDatoscoches() {

    let tabla = document.getElementById("contenidocoches");
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/api/nodes", true);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            info = JSON.parse(this.response);
            tabla.innerHTML = ' ';
            for (item of info){
                if(item.state == 0){
                    tabla.innerHTML+= 
                    `
                    <tr class="nokey">
                        <td>${item.id}</td>
                        <td>
                        <select class="modificacion decorated custom-select"> 
                            <option value="0" selected> No disponible</option>
                            <option value="1"> Disponible</option>
                            <option value="2"> Ocupado</option>
                            <option value="3" > Cargando</option>
                            <option value="4"> En la parada</option>
                        </select></td>
                        <td> Position X: ${item.location_x} Position Y: ${item.location_y} </td>
                        
                    </tr>` 
                }
                if(item.state == 1){
                    tabla.innerHTML+= 
                    `
                    <tr class="okey">
                        <td>${item.id}</td>
                        <td>
                        <select class ="modificacion decorated custom-select"> 
                            <option value="0"> No disponible</option>
                            <option value="1" selected> Disponible</option>
                            <option value="2"> Ocupado</option>
                            <option value="3" > Cargando</option>
                            <option value="4"> En la parada</option>
                        </select></td>
                        <td> Position X: ${item.location_x} Position Y: ${item.location_y} </td>
                        
                    </tr>` 
                }
                if(item.state == 2){
                    tabla.innerHTML+= 
                    `
                    <tr class="ocupado">
                        <td>${item.id}</td>
                        <td>
                        <select class="modificacion decorated custom-select"> 
                            <option value="0"> No disponible</option>
                            <option value="1"> Disponible</option>
                            <option value="2" selected> Ocupado</option>
                            <option value="3" > Cargando</option>
                            <option value="4"> En la parada</option>
                        </select></td>
                        <td> Position X: ${item.location_x} Position Y: ${item.location_y} </td>
                        
                    </tr>` 
                }
                if(item.state == 3){
                    tabla.innerHTML+= 
                    `
                    <tr class="cargando">
                        <td>${item.id}</td>
                        <td>
                        <select class="modificacion decorated custom-select "> 
                            <option value="0"> No disponible</option>
                            <option value="1"> Disponible</option>
                            <option value="2"> Ocupado</option>
                            <option value="3" selected> Cargando</option>
                            <option value="4"> En la parada</option>
                        </select></td>
                        <td> Position X: ${item.location_x} Position Y: ${item.location_y} </td>
                        
                    </tr>` 
                }
                if(item.state == 4){
                    tabla.innerHTML+= 
                    `
                    <tr class="parada">
                        <td>${item.id}</td>
                        <td>
                        <select class="modificacion decorated custom-select "> 
                            <option value="0"> No disponible</option>
                            <option value="1"> Disponible</option>
                            <option value="2"> Ocupado</option>
                            <option value="3"> Cargando</option>
                            <option value="4" selected> En la parada</option>
                        </select></td>
                        <td> Position X: ${item.location_x} Position Y: ${item.location_y} </td>
                        
                    </tr>` 
                }
            }
        }
    };
};

$(document).ready(traerDatoscoches);

// Modificar coches
// Tenemos la variable info que guarda los datos de los coches.
function modificar(row){
    for(var i= 0; i<row.length; ++i){
        let xhttp = new XMLHttpRequest();
        xhttp.open("PUT", "http://localhost:3000/api/nodes", true);
        xhttp.setRequestHeader("miclavesecreta", token.token);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.send(JSON.stringify({
            id :  row[i].id,
            state: row[i].state
        }));
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                $("#coches").load(traerDatoscoches());
            }
            else if(this.readyState == 4 && this.status == 403){
                document.getElementById("alertaautent1").style.display ="block";
            }
        }
    }
};

$(document).ready(function(){
    document.getElementById("modif2").addEventListener("click", function(){
        const row = document.getElementsByClassName("modificacion");
        let cambia = 0;
        let idnodo = [];
        let nombres = [];
        let i = 0;
        for(item of info){
            let x = row[i].selectedIndex
            if(row[i].options[x].value != item.state){
                let envia = {
                    id: item.id,
                    state: row[i].options[x].value
                }
                idnodo.push(envia);
                nombres.push(item.id)
                cambia = 1;
            }
            ++i;
        }
        if(cambia){
            if(nombres.length ==1){
                swal({
                    title: "¿Estás seguro que quieres modificar el estado de este coche?"+ " "+ nombres[0],
                    icon: "warning",
                    buttons: true,
                  })
                  .then((willDelete) => {
                    if (willDelete) {
                        modificar(idnodo)
                        swal("El estado del coche se ha modificado correctamente", {
                            icon: "success",
                        });
                    }
                    else{
                        $("#coches").load(traerDatoscoches());
                    }
                  });
            }
            else{
                swal({
                    title: "¿Estás seguro que quieres modificar el estado de estos coches?"+ " "+ nombres.join(","),
                    icon: "warning",
                    buttons: true,
                  })
                  .then((willDelete) => {
                    if (willDelete) {
                        modificar(idnodo)
                        swal("El estado de los respectivos coches se han modificado correctamente", {
                            icon: "success",
                        });
                    }
                    else{
                        $("#coches").load(traerDatoscoches());
                    }
                  });
               
            }
        }
    })
});

// Añadir coches
function anadir2() {

    var inputs2 = document.getElementsByClassName("inpts2");
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3000/api/nodes", true);
    xhttp.setRequestHeader("miclavesecreta", token.token);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({
        id: inputs2[0].value,
        location_x: inputs2[1].value,
        location_y: inputs2[2].value,
        destination: inputs2[3].value,
    }));
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            inputs2[0].value ="";
            inputs2[1].value="";
            inputs2[2].value="";
            inputs2[3].value="";
            $(document.getElementById("anadecoche")).toggle(500)
            document.getElementById("modif2").style.display = "block";
            document.getElementById("abre2").style.display = "block";
            document.getElementById("elimina").style.display = "block";
            document.getElementById("alerta").style.display ="none";
            document.getElementById("filtrocoche").value= "0";
            $("#coches").load(traerDatoscoches());
        }
        else if(this.readyState == 4 && this.status == 403){
            document.getElementById("alertaautent1").style.display ="block";
        }
        else if(this.readyState == 4 && this.status != 200){
            document.getElementById("alerta").style.display ="block";
        }
    };
};

$(document).ready(function(){
    var anade = document.getElementById("anade2");
    anade.addEventListener("click", anadir2);
});

// Eliminar coches
function eliminar() {

    var inputs3 = document.getElementById("inpts3");
    
    let xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "http://localhost:3000/api/nodes", true);
    xhttp.setRequestHeader("miclavesecreta", token.token);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({
        id: inputs3.value
    }));
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            swal("El coche se ha eliminado correctamente", {
                icon: "success",
            });
            inputs3.value ="";
            $(document.getElementById("formeliminacoche")).toggle(500)
            document.getElementById("modif2").style.display = "block";
            document.getElementById("abre2").style.display = "block";
            document.getElementById("elimina").style.display = "block";
            document.getElementById("alerta").style.display ="none";
            $("#coches").load(traerDatoscoches());
        }
        else if(this.readyState == 4 && this.status == 403){
            document.getElementById("alertaautent1").style.display ="block";
        }
        else if(this.readyState == 4 && this.status != 200){
            document.getElementById("alerta").style.display ="block";
        }
    };
};

$(document).ready(function(){
    var elimina = document.getElementById("elimina1");
    elimina.addEventListener("click", function(){
        swal({
            title: "¿Estás seguro que quieres eliminar este coche?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                eliminar();
            }
          });
    });
});

// Filtro coches
function cambia(){
    let disponible = document.getElementsByClassName("okey");
    let nodisponible = document.getElementsByClassName("nokey");
    let ocupado = document.getElementsByClassName("ocupado");
    let cargando = document.getElementsByClassName("cargando");
    let parada = document.getElementsByClassName("parada");
    let select= document.getElementById("filtrocoche");
    let x = select.selectedIndex;
    if(select.options[x].text== "No disponible"){
        for(var i =0 ; i<nodisponible.length; ++i){
            nodisponible[i].style.display =""
        }
        for(var i =0 ; i<disponible.length; ++i){
            disponible[i].style.display ="none"
        }
        for(var i =0 ; i<cargando.length; ++i){
            cargando[i].style.display ="none"
        }
        for(var i =0 ; i<parada.length; ++i){
            parada[i].style.display ="none"
        }
        for(var i =0 ; i<ocupado.length; ++i){
            ocupado[i].style.display ="none"
        }
    }
    else if(select.options[x].text== "Disponible"){
        for(var i =0 ; i<disponible.length; ++i){
            disponible[i].style.display =""
        }
        for(var i =0 ; i<nodisponible.length; ++i){
            nodisponible[i].style.display ="none"
        }
        for(var i =0 ; i<cargando.length; ++i){
            cargando[i].style.display ="none"
        }
        for(var i =0 ; i<parada.length; ++i){
            parada[i].style.display ="none"
        }
        for(var i =0 ; i<ocupado.length; ++i){
            ocupado[i].style.display ="none"
        }
    }
    else if(select.options[x].text== "Cargando"){
        for(var i =0 ; i<disponible.length; ++i){
            disponible[i].style.display ="none"
        }
        for(var i =0 ; i<nodisponible.length; ++i){
            nodisponible[i].style.display ="none"
        }
        for(var i =0 ; i<cargando.length; ++i){
            cargando[i].style.display =""
        }
        for(var i =0 ; i<parada.length; ++i){
            parada[i].style.display ="none"
        }
        for(var i =0 ; i<ocupado.length; ++i){
            ocupado[i].style.display ="none"
        }
    }
    else if(select.options[x].text== "Ocupado"){
        for(var i =0 ; i<disponible.length; ++i){
            disponible[i].style.display ="none"
        }
        for(var i =0 ; i<nodisponible.length; ++i){
            nodisponible[i].style.display ="none"
        }
        for(var i =0 ; i<cargando.length; ++i){
            cargando[i].style.display ="none"
        }
        for(var i =0 ; i<parada.length; ++i){
            parada[i].style.display ="none"
        }
        for(var i =0 ; i<ocupado.length; ++i){
            ocupado[i].style.display =""
        }
    }
    else if(select.options[x].text== "En la parada"){
        for(var i =0 ; i<disponible.length; ++i){
            disponible[i].style.display ="none"
        }
        for(var i =0 ; i<nodisponible.length; ++i){
            nodisponible[i].style.display ="none"
        }
        for(var i =0 ; i<cargando.length; ++i){
            cargando[i].style.display ="none"
        }
        for(var i =0 ; i<parada.length; ++i){
            parada[i].style.display =""
        }
        for(var i =0 ; i<ocupado.length; ++i){
            ocupado[i].style.display ="none"
        }
    }
    else if(select.options[x].text== "Todos"){
        for(var i =0 ; i<disponible.length; ++i){
            disponible[i].style.display =""
        }
        for(var i =0 ; i<nodisponible.length; ++i){
            nodisponible[i].style.display =""
        }
        for(var i =0 ; i<cargando.length; ++i){
            cargando[i].style.display =""
        }
        for(var i =0 ; i<parada.length; ++i){
            parada[i].style.display =""
        }
        for(var i =0 ; i<ocupado.length; ++i){
            ocupado[i].style.display =""
        }
    }
}

$(document).ready(function(){
    let botonfiltro = document.getElementById("cambiacoches");
    botonfiltro.addEventListener("click", cambia);
})
