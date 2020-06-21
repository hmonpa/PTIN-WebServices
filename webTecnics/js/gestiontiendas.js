
// Mostrar añadir tienda
let abretienda = function(){
    $("#abretienda").click(function(ev){
       ev.preventDefault();
       let $element= $(this).parent().prev().prev();
       $element.toggle(500)
       setTimeout(function(){
            window.scrollTo(0,$(document).height())
        }, 500)
       document.getElementById("abretienda").style.display = "none";
       document.getElementById("eliminatienda").style.display = "none";
    })
}

let cierratienda = function(){
   $("#atrastienda").click(function(ev){
       ev.preventDefault();
       let $element= $(this).parent().parent();
       $element.toggle(500)
       document.getElementById("abretienda").style.display = "block";
       document.getElementById("eliminatienda").style.display = "block";
       document.getElementById("alerta5").style.display="none"
       let inps = document.getElementsByClassName("inpstiendas");
       for(item of inps){
           if(item.classList.contains("tienda")){
               item.value=0
           }
           else{
            item.value =""
           }
       }
   })
}

$(document).ready(abretienda);
$(document).ready(cierratienda);

//Mostrar eliminar tienda
let deletetienda = function(){
    $("#eliminatienda").click(function(ev){
       ev.preventDefault();
       let $element= $(this).parent().prev();
       $element.toggle(500)
       setTimeout(function(){
            window.scrollTo(0,$(document).height())
        }, 500)
       document.getElementById("abretienda").style.display = "none";
       document.getElementById("eliminatienda").style.display = "none";
    })
}

let cierratienda2 = function(){
   $("#atrastienda2").click(function(ev){
       ev.preventDefault();
       let $element = $(this).parent().parent();
       $element.toggle(500)
       document.getElementById("abretienda").style.display = "block";
       document.getElementById("eliminatienda").style.display = "block";
       document.getElementById("alerta5").style.display="none"
       let inps = document.getElementById("eliminartienda");
       inps.value=""
   })
}

$(document).ready(deletetienda);
$(document).ready(cierratienda2);

//Mostrar las ofertas de cada tienda
function ensoferta(){
    let table = document.getElementById("tablatiendas")

    table.addEventListener("click", function(){
        let tds = event.path[1];
        if(tds.className == "tienda" ){
            $(tds).next().toggle("fast");
        }
    });
}

$(document).ready(ensoferta)

//Traer las tiendas desde la base de datos
function traerTiendas(){
    let tabla = document.getElementById("tiendas");

    let xhttp = new XMLHttpRequest;
    xhttp.open("GET", "http://localhost:3000/api/shops");
    xhttp.setRequestHeader("miclavesecreta", token.token);
    xhttp.send();
    
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            let tiendas = JSON.parse(this.response);
            tabla.innerHTML = ' ';
            let a = 0;
            for (item of tiendas){
                let ar =[]
                for(var i=0; i <item.promotions.length; ++i){
                    ar.push(item.promotions[i].offer);
                }
                tabla.innerHTML+= 
                `
                <tr class ="tienda" >
                    <td>${item.name}</td>
                    <td>${item.type}</td>
                    <td>${item.product_name}</td>
                </tr>
                <tr class="ofertas">
                    <td>
                        <div id= "offers${a}" ></div>
                        <input class = "inpsoferta" type ="text" placeholder= "Añade una oferta" > 
                        <button class="anadeoferta btn btn-warning" type="button"> Oferta</button>
                    </td>
                </tr>
                `
                //Añadir las ofertas en parrafos para así interactuar con ellas 
                let listaofertas = document.getElementById("offers"+ a);
                listaofertas.innerHTML+= ' '
                for(var j = 0; j < ar.length; ++j){
                    listaofertas.innerHTML+= `<p class="poffers">${ar[j]}</p> <button type="button" class="eliminaoferta btn btn-danger" style="display:none;">Eliminar</button>`
                }
                ++a;
            }

            // Añadir un evento a los botones de modificar ofertas
            var divs = document.getElementsByClassName("anadeoferta");
            for (var i=0; i< divs.length; i++) {
                divs[i].addEventListener("click",function() {
                   var oferta = this.previousElementSibling.value;
                   let inpss = document.getElementsByClassName("inpsoferta");
                   var tipo = $(this).parent().parent().prev().children()[1].innerText;
                   var servicio = $(this).parent().parent().prev().children()[0].innerText;
                   swal({
                    title: "Revisa tu oferta",
                    text: "Tienda: "+ servicio + "\nOferta: "+ oferta,
                    icon: "warning",
                    buttons: true,
                  })
                  .then((success) => {
                    if (success) {
                        anadeofert(oferta,servicio,tipo)
                        inpss.value = ""
                        swal("La oferta ha sido añadida correctamente", {
                            icon: "success",
                        });
                    }
                  });
                })
            }

            // Esto es para enseñar el botón de eliminar oferta
            var poffers = document.getElementsByClassName("poffers");
            for(var i = 0; i <poffers.length; ++i){
                poffers[i].addEventListener("click",function() {
                    var btnoferta = this.nextElementSibling;
                    $(btnoferta).toggle(100);
                })
            }

            var eofertas = document.getElementsByClassName("eliminaoferta");
            for(var i = 0; i <eofertas.length; ++i){
                eofertas[i].addEventListener("click",function() {
                    var nombretienda = $(this).parent().parent().parent().prev().children()[0].innerText;
                    let inpss = document.getElementsByClassName("inpsoferta");
                    var ofertaout = $(this).prev().text();
                    swal({
                        title: "¿Estás seguro de que quieres eliminar esta oferta?",
                        text: "Tienda: "+ nombretienda + "\nOferta: "+ ofertaout,
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    })
                    .then((willDelete) => {
                    if (willDelete) {
                        eliminaofert(nombretienda,ofertaout);
                        inpss.value = ""
                        swal("La oferta ha sido eliminado correctamente", {
                            icon: "success",
                        });
                    }
                    });
                })
            }
        }
    }
}

$(document).ready(traerTiendas);

//Añadir tienda
function anadetienda(){
    let inpstiendas = document.getElementsByClassName("inpstiendas");
    let x = inpstiendas[2].selectedIndex
    let xhttp = new XMLHttpRequest;
    xhttp.open("POST", "http://localhost:3000/api/shops");
    xhttp.setRequestHeader("miclavesecreta", token.token);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({
        id: inpstiendas[0].value,
        name: inpstiendas[1].value,
        type: inpstiendas[2].options[x].text,
        product_name: inpstiendas[3].value,
        url_image:inpstiendas[4].value,
        location_x: inpstiendas[5].value,
        location_y: inpstiendas[6].value
    }));
    
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            let inps = document.getElementsByClassName("inpstiendas");
            for(item of inps){
                if(item.classList.contains("tienda")) item.value ="0";
                else{
                    item.value =""
                }
            }
            swal("El servicio se ha añadido correctamente", {
                icon: "success",
            });
            let form = document.getElementById("formtiendas")
            $(form).toggle(500)
            document.getElementById("abretienda").style.display = "block";
            document.getElementById("eliminatienda").style.display = "block";
            document.getElementById("alerta5").style.display="none"
            $("#tablatiendas").load(traerTiendas());
        }
        else if(this.readyState == 4 && this.status == 403){
            document.getElementById("alertaautent2").style.display ="block";
        }
        else if(this.readyState == 4 && (this.status !=200 || this.status != 403)){
            document.getElementById("alerta5").style.display="block"
        }
    }
}

$(document).ready(function(){
    let atienda = document.getElementById("anadetienda");
    atienda.addEventListener("click", function(){
        swal({
            title: "¿Seguro que quieres añadir una tienda?",
            text: "Esto significa que un nuevo negocio ha sido instalado en el aeropuerto.",
            icon: "warning",
            buttons: true,
          })
          .then((success) => {
            if (success) {
                anadetienda();
            }
          });
    });
})

//Eliminar tienda
function deltienda(inpstiendas){
    let xhttp = new XMLHttpRequest;
    xhttp.open("DELETE", "http://localhost:3000/api/shops");
    xhttp.setRequestHeader("miclavesecreta", token.token);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({
        name: inpstiendas
    }));
    
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            swal("El servicio ha sido eliminado correctamente", {
                icon: "success",
            });
            let form = document.getElementById("formeliminatienda")
            $(form).toggle(500)
            document.getElementById("abretienda").style.display = "block";
            document.getElementById("eliminatienda").style.display = "block";
            $("#tablatiendas").load(traerTiendas());
        }
        else if(this.readyState == 4 && this.status == 403){
            document.getElementById("alertaautent2").style.display ="block";
        }
        else if(this.readyState == 4 && (this.status !=200 || this.status != 403)){
            document.getElementById("alerta5").style.display="block"
        }
    }
}

$(document).ready(function(){
    let dtienda = document.getElementById("eliminatienda2");
    dtienda.addEventListener("click", function(){
        let inpstiendas = document.getElementById("eliminartienda");
        var nombreaeliminar = inpstiendas.value
        swal({
            title: "¿Estás seguro que quieres eliminar esta tienda?"+ " "+ nombreaeliminar,
            text: "Esto significa que este servicio ha dejado de estar en el aeropuerto",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                deltienda(inpstiendas.value);
                inpstiendas.value=""
            }
          });
    });
})

//Añadir oferta
function anadeofert(oferta, servicio,tipo){
    let xhttp = new XMLHttpRequest;
    xhttp.open("PUT", "http://localhost:3000/api/shops");
    xhttp.setRequestHeader("miclavesecreta", token.token);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({
        name: servicio,
        promotion: {
            offer: oferta
        },
        type: tipo
    }));
    
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            document.getElementsByClassName("inpsoferta").value=""
            $("#tablatiendas").load(traerTiendas());
        }
        else if(this.readyState == 4 && this.status == 403){
            document.getElementById("alertaautent2").style.display ="block";
        }
    }
}

//Eliminar oferta
function eliminaofert(nombre,promocion){
    let xhttp = new XMLHttpRequest;
    xhttp.open("DELETE", "http://localhost:3000/api/shopsElimina");
    xhttp.setRequestHeader("miclavesecreta", token.token);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify({
        name: nombre,
        promotion: promocion
    }));
    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            $("#tablatiendas").load(traerTiendas());
        }
        else if(this.readyState == 4 && this.status == 403){
            document.getElementById("alertaautent2").style.display ="block";
        }
    } 
}

//Filtro para el tipo de tienda
function cambia_tienda(){
    let tiendas = document.getElementsByClassName("tienda");
    let select= document.getElementById("filtrotienda");
    let x = select.selectedIndex;
    if(select.options[x].text== "Restauración"){
        for(var i =0 ; i<tiendas.length; ++i){
            if(tiendas[i].childNodes[3].textContent != "Restauración") tiendas[i].style.display = "none";
            else tiendas[i].style.display = ""
        }
    }
    else if(select.options[x].text== "Ropa"){
        for(var i =0 ; i<tiendas.length; ++i){
            if(tiendas[i].childNodes[3].textContent != "Ropa") tiendas[i].style.display = "none"
            else tiendas[i].style.display = ""
        }
    }
    else if(select.options[x].text== "Ocio"){
        for(var i =0 ; i<tiendas.length; ++i){
            if(tiendas[i].childNodes[3].textContent != "Ocio") tiendas[i].style.display = "none"
            else tiendas[i].style.display = ""
        }
    }
    else if(select.options[x].text== "DutyFree"){
        for(var i =0 ; i<tiendas.length; ++i){
            if(tiendas[i].childNodes[3].textContent != "DutyFree") tiendas[i].style.display = "none"
            else tiendas[i].style.display = ""
        }
    }
    else if(select.options[x].text== "Otros"){
        for(var i =0 ; i<tiendas.length; ++i){
            if(tiendas[i].childNodes[3].textContent != "Otros") tiendas[i].style.display = "none"
            else tiendas[i].style.display = ""
        }
    }
    else if(select.options[x].text== "Todos"){
        for(var i =0 ; i<tiendas.length; ++i){
            tiendas[i].style.display = ""
        }
    }
}

$(document).ready(function(){
    let botonfiltro = document.getElementById("cambiatiendas");
    botonfiltro.addEventListener("click", cambia_tienda);
})
