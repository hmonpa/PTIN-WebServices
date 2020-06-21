//moment.locale("es");


window.onbeforeunload = function(){
  this.localStorage.setItem("origen","")
  this.localStorage.setItem("destino","")
  this.localStorage.setItem("fechaVuelo","")
};


function filtros() {
  var origen=this.localStorage.getItem("origen")
  var destino=this.localStorage.getItem("destino")
  var fechaVuelo=this.localStorage.getItem("fechaVuelo")
  if(origen != "" || destino != "" || fechaVuelo != "") {
      traerDatos2();

  } else {
      traerDatos();
  } 
}

$(document).ready(filtros());


function traerDatos2() {
  console.log("traerDatos2");
  var title_text = document.getElementById("title-text");
  var title_div = document.getElementById("title-div");
  var title_default = document.getElementById("title-default");
  title_div.style.display = "block";
  title_default.style.display = "none";
  
  
  var num = 0;
  var num2 = 30;
  var origen=this.localStorage.getItem("origen")
  var destino=this.localStorage.getItem("destino")
  var fech = this.localStorage.getItem("fechaVuelo")
  if(fech != "") {
    var fecha = fech[8] + fech[9]+ "/"+ fech[5]+ fech[6]+ "/"+ fech[0]+ fech[1]+ fech[2]+ fech[3];
  }
 

  if(origen != "") {
    var origen1 = origen;
  } else {
    var origen1 = "cualquier origen"
  }

  if(destino != "") {
    var destino1 = destino;
  } else {
    var destino1 = "cualquier destino"
  }

  title_text.textContent = "Vuelos desde " + origen1 + " a " + destino1 + " ";

  if(fech != "") {
    title_text.textContent += "el dia " + fecha;
  }
  
  var tabla = document.getElementById("contenidovuelos");
  var list = document.getElementById("lista-vuelos");
  var xhttp = new XMLHttpRequest();

  xhttp.open("GET", "http://localhost:3000/api/flights", true);
  xhttp.send();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          let datos = JSON.parse(this.response)
          datos.sort(function(a, b) {
              return a.date > b.date;
          });
          
          var groupBy = function(xs, key) {
              return xs.reduce(function(rv, x) {
                (rv[x[key]] = rv[x[key]] || []).push(x);
                return rv;
              }, {});
            };
            var groubedByDate=groupBy(datos, 'date')   
                
            if(fech != "") {
                console.log("1")
                 Object.keys(groubedByDate).forEach(function(category){
                 var fechaVuelos = moment(category).format('DD/MM/YYYY')
                 console.log("Fecha: " + fecha)
                 console.log("Fecha1: " + fechaVuelos)
                  if(fecha == fechaVuelos) { 
                    console.log("Fecha valida " + fecha)
                    var añadido = false;
                    list.innerHTML+=
                    `
                    <li id ="${num2}">
                      <div class="row d-flex justify-content-start "> 
                        <a class="ml-5 mr-1"> Fecha ${moment(category).format('DD/MM/YYYY')} </a>
                      </div>
  
                      <div class="mt-2"> 
                        <table class="table table-hover" id="myTable">
                          <thead class="thead-dark">
                          <tr>
                            <th>Vuelo</th>										
                            <th>Hora de embarque</th>                       
                            <th>Puerta</th>
                            <th>Aerolinea</th>
                            <th>Origen</th>
                            <th>Destino</th>
                            
                            </tr>
                          </thead>
                          <tbody id="${num}">
                                                
                        </tbody>
                        </table>
                      </div>									
                    </li>
  
                    `
  
                    
                    
                    //console.log(`Team ${category} has ${groubedByDate[category].length} members : `);
                    groubedByDate[category].forEach(function(memb,i){                       
                          var tabla2 = document.getElementById(num)                                          
                          //var horaAux = memb.boarding_time                     
                          var hora = moment(memb.boarding_time).locale('es').format('HH:mm')                      
                         
                         if( hora > $("#horaMin option:selected").text() && hora <  $("#horaMax option:selected").text()) { 
                              if(filtered(memb) == true) {   
                                if(origen != "" && destino != "") { 
                                  console.log("1");   
                                  if(memb.from == origen && memb.to == destino) {                                           
                                  tabla2.innerHTML+= 
                                    `<tr data-href="Vuelos_localizador.html" data-vuelo="${memb.name}">                    
                                        <th>${memb.name}</th>
                                        <th>${moment(memb.boarding_time).locale('es').format('HH:mm')}</th>                                  
                                        <th>${memb.gate.name}</th>
                                        <th>${memb.airline}</th>
                                        <th>${memb.from} </th> 
                                        <th>${memb.to} </th>                                                         
                                    </tr>`  
                                    añadido = true; 
                                  }
                                } else if(origen != ""){
                                  console.log("2");
                                  if(memb.from == origen) {                              
                                    tabla2.innerHTML+= 
                                    `<tr data-href="Vuelos_localizador.html" data-vuelo="${memb.name}">                    
                                        <th>${memb.name}</th>
                                        <th>${moment(memb.boarding_time).locale('es').format('HH:mm')}</th>                                        
                                        <th>${memb.gate.name}</th>
                                        <th>${memb.airline}</th>
                                        <th>${memb.from} </th> 
                                        <th>${memb.to} </th>                                                         
                                    </tr>`    
                                  añadido = true; 
                                  }
                                
                              } else if(destino != "") {
                                console.log("3"); 
                                if(memb.to == destino) { 
                                  tabla2.innerHTML+=                            
                                `<tr data-href="Vuelos_localizador.html" data-vuelo="${memb.name}">                    
                                    <th>${memb.name}</th>
                                    <th>${moment(memb.boarding_time).locale('es').format('HH:mm')}</th>                              
                                    <th>${memb.gate.name}</th>
                                    <th>${memb.airline}</th>
                                    <th>${memb.from} </th> 
                                        <th>${memb.to} </th>                                                         
                                  </tr>`  
                                  añadido = true; 
                                }
                              } else if(origen == "" && destino == ""){
                                  console.log("4");
                                  tabla2.innerHTML+=   
                                  `<tr data-href="Vuelos_localizador.html" data-vuelo="${memb.name}">                    
                                  <th>${memb.name}</th>
                                  <th>${moment(memb.boarding_time).locale('es').format('HH:mm')}</th>                              
                                  <th>${memb.gate.name}</th>
                                  <th>${memb.airline}</th>
                                  <th>${memb.from} </th> 
                                      <th>${memb.to} </th>                                                         
                                </tr>`  
                                añadido = true; 
                              }
                            }
                        } 
                                  
                    })
  
                    if(añadido == false) {
                      var tabla3 = document.getElementById(num2);
                      tabla3.style.display = "none";
                    }
                    num2++;
                    num++;}
                 
            });
          } else {
            console.log("2")
            Object.keys(groubedByDate).forEach(function(category){    
             
                 var añadido = false;
                 list.innerHTML+=
                 `
                 <li id ="${num2}">
                   <div class="row d-flex justify-content-start "> 
                     <a class="ml-5 mr-1"> Fecha ${moment(category).format('DD/MM/YYYY')} </a>
                   </div>

                   <div class="mt-2"> 
                     <table class="table table-hover" id="myTable">
                       <thead class="thead-dark">
                       <tr>
                         <th>Vuelo</th>										
                         <th>Hora de embarque</th>                       
                         <th>Puerta</th>
                         <th>Aerolinea</th>
                         <th>Origen</th>
                         <th>Destino</th>
                         
                         </tr>
                       </thead>
                       <tbody id="${num}">
                                             
                     </tbody>
                     </table>
                   </div>									
                 </li>

                 `

                 
                 
                 //console.log(`Team ${category} has ${groubedByDate[category].length} members : `);
                 groubedByDate[category].forEach(function(memb,i){                       
                       var tabla2 = document.getElementById(num)                                          
                      // var horaAux = memb.boarding_time                     
                       var hora = moment(memb.boarding_time).locale('es').format('HH:mm')                     
                      
                      if( hora > $("#horaMin option:selected").text() && hora <  $("#horaMax option:selected").text()) { 
                           if(filtered(memb) == true) {   
                             if(origen != "" && destino != "") { 
                               console.log("1");   
                               if(memb.from == origen && memb.to == destino) {                                           
                               tabla2.innerHTML+= 
                                 `<tr data-href="Vuelos_localizador.html" data-vuelo="${memb.name}">                    
                                     <th>${memb.name}</th>
                                     <th>${moment(memb.boarding_time).locale('es').format('HH:mm')}</th>                                  
                                     <th>${memb.gate.name}</th>
                                     <th>${memb.airline}</th>
                                     <th>${memb.from} </th> 
                                     <th>${memb.to} </th>                                                         
                                 </tr>`  
                                 añadido = true; 
                               }
                             } else if(origen != ""){
                               console.log("2");
                               if(memb.from == origen) {                              
                                 tabla2.innerHTML+= 
                                 `<tr data-href="Vuelos_localizador.html" data-vuelo="${memb.name}">                    
                                     <th>${memb.name}</th>
                                     <th>${moment(memb.boarding_time).locale('es').format('HH:mm')}</th>                                     
                                     <th>${memb.gate.name}</th>
                                     <th>${memb.airline}</th>
                                     <th>${memb.from} </th> 
                                     <th>${memb.to} </th>                                                         
                                 </tr>`    
                               añadido = true; 
                               }
                             
                           } else if(destino != "") {
                             console.log("3"); 
                             if(memb.to == destino) { 
                               tabla2.innerHTML+=                            
                             `<tr data-href="Vuelos_localizador.html" data-vuelo="${memb.name}">                    
                                 <th>${memb.name}</th>
                                 <th>${moment(memb.boarding_time).locale('es').format('HH:mm')}</th>                              
                                 <th>${memb.gate.name}</th>
                                 <th>${memb.airline}</th>
                                 <th>${memb.from} </th> 
                                     <th>${memb.to} </th>                                                         
                               </tr>`  
                               añadido = true; 
                             }
                           }
                         }
                     } 
                               
                 })

                 if(añadido == false) {
                   var tabla3 = document.getElementById(num2);
                   tabla3.style.display = "none";
                 }
                 num2++;
                 num++;
              
            });

          }
       
      
      }
  };
};


function traerDatos() {
    console.log("traerDatos");
    
    this.localStorage.setItem("origen","");
    this.localStorage.setItem("destino","");
    this.localStorage.setItem("fechaVuelo","");
    var num = 0;
    var num2 = 30;
    var tabla = document.getElementById("contenidovuelos");
    var list = document.getElementById("lista-vuelos");
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/api/flights", true);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let datos = JSON.parse(this.response)
            datos.sort(function(a, b) {
                return a.date > b.date;
            });
            
            var groupBy = function(xs, key) {
                return xs.reduce(function(rv, x) {
                  (rv[x[key]] = rv[x[key]] || []).push(x);
                  return rv;
                }, {});
              };
              var groubedByDate=groupBy(datos, 'date')           
            

            Object.keys(groubedByDate).forEach(function(category){
                var añadido = false;
                list.innerHTML+=
                `
                <li id ="${num2}">
                  <div class="row d-flex justify-content-start "> 
                    <a class="ml-5 mr-1"> Fecha ${moment(category).format('DD/MM/YYYY')} </a>
                  </div>

                  <div class="mt-2"> 
                    <table class="table table-hover" id="myTable">
                      <thead class="thead-dark">
                      <tr>
                        <th>Vuelo</th>										
                        <th>Hora de embarque</th>                        
                        <th>Puerta</th>
                        <th>Aerolinea</th>
                        <th>Origen</th>
                        <th>Destino</th>
                        
                        </tr>
                      </thead>
                      <tbody id="${num}">
                                            
                    </tbody>
                    </table>
                  </div>									
                </li>

                `
                
                
             
                 groubedByDate[category].forEach(function(memb,i){                       
                       var tabla2 = document.getElementById(num) 
                       //var horaAux = memb.boarding_time                     
                       var hora = moment(memb.boarding_time).locale('es').format('HH:mm')              

                      if( hora > $("#horaMin option:selected").text() && hora <  $("#horaMax option:selected").text()) { 
           
                        if(filtered(memb) == true) {             
                                  
                            tabla2.innerHTML+= 
                              `<tr  data-vuelo="${memb.name}">                    
                                  <th>${memb.name}</th>
                                  <th>${moment(memb.boarding_time).locale('es').format('HH:mm')}</th>
                                  <th>${memb.gate.name}</th>
                                  <th>${memb.airline}</th>
                                  <th>${memb.from.split(";")[0]} </th> 
                                  <th>${memb.to.split(";")[0]}</th>                                                      
                              </tr>`  
                              añadido = true; 
                        } 
                      }              
                })

                if(añadido == false) {
                  var tabla3 = document.getElementById(num2);
                  tabla3.style.display = "none";
                }
                num2++;
                num++;
           });
         
            
        }
    };
};







$(document).ready(function(){
      
    $(document.body).on("click", "tr[data-href]", function() {         
       window.location.href = this.dataset.href;
  })
})

$(document).ready(function(){
       
    $(document.body).on("click", "tr[data-vuelo]", function() {         
       
       var vuelo = this.dataset.vuelo;
       localStorage.setItem("localizadorvuelo",vuelo);       
       location.href = 'Vuelos_localizador.html';
  })
})


  

  


function filtered(memb) {
  var iberia= document.getElementById("aerolineaCheckbox1");
  var vueling = document.getElementById("aerolineaCheckbox2");
  var aireuropa = document.getElementById("aerolineaCheckbox3"); 
  var vilanova = document.getElementById("aerolineaCheckbox4"); 
  var qatar = document.getElementById("aerolineaCheckbox5"); 
  var klm = document.getElementById("aerolineaCheckbox6"); 

  var bool = false;
  if(iberia.checked) {
    if(memb.airline == "IBERIA") {
      bool = true;
    }
  }
  if(vueling.checked) {
    if(memb.airline == "Vueling") {
      bool = true; 
    }
  }
  if(aireuropa.checked) {
    if(memb.airline == "AirEuropa" ) {
      bool = true;
    }
  }
  if(vilanova.checked) {
    if(memb.airline == "Vilanova Airlines"){
      bool = true;
    }
  }
  if(qatar.checked) {
    if(memb.airline == "QATAR Airways"){
      bool = true;
    }
  }
  if(klm.checked) {
    if(memb.airline == "KLM"){
      bool = true;
    }
  } 

  return bool;
}

let actualiza = function() {
  $("#actualizar-button").click(function(ev){
    ev.preventDefault()
    var container = document.getElementById("lista-vuelos");
    var content = container.innerHTML ="";
    container.innerHTML= content;  
    var title_text = document.getElementById("title-text");
    var title_div = document.getElementById("title-div");
    var title_default = document.getElementById("title-default"); 
    title_div.style.display ="none" ;
    title_default.style.display ="inline";    
    traerDatos();   

  })  
}

$(document).ready(actualiza);

let Afiltros = function() {
  $("#actualizar-filtros").click(function(ev){
    ev.preventDefault()
   console.log("actualizar filtros")
   var container = document.getElementById("lista-vuelos");
    var content = container.innerHTML ="";
    container.innerHTML= content;  
    filtros();   
  })  
}

$(document).ready(Afiltros);


