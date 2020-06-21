
// Creacion de colecciones

db.createCollection("administrators");
db.createCollection("operators");
db.createCollection("passengers");
db.createCollection("nodes");
db.createCollection("flights");
db.createCollection("shops");
db.createCollection("stops");
db.createCollection("boarding_passes");

// Operadores

db.operators.insert({
	id: "operador2",
	name: "Isabella Avila",
	email: "isabellavila@gmail.com",
	birthdate: new Date("1975-12-06T16:00:00Z"),
	phone: "+34 916718544",
	password: "m1n2b3v2",
	airline: "IBERIA"
	});

// Pasajeros
db.passengers.insert({
	id: "45872359V",
	name: "Paco Gonzalez",
	type_user: 1,
	email: "pgonzalez@gmail.com",
	birthdate: "1998-07-29",
	phone: "689848989",
	password: "12345",
	country: "España",
	city: "Murcia",
	location_x: 118,
	location_y: 165
	});

// Tarjetas de embarque
db.boarding_passes.insert({
	id_hash: "756xMl212251Xasa",
        seat: "1A",
        id_passenger: "12345678X",
	name_passenger: "Paco Gonzalez",
        flights: "VL0204"
	});

// Coches
db.nodes.insert({
	id:"CH0001",
	location_x: 0,
	location_y: 0,
	destination: 200
});

db.nodes.insert({
	id:"CH0002",
	location_x: 20,
	location_y: 30,
	destination: 300
});

db.nodes.insert({
	id:"CH0003",
	location_x: 50,
	location_y: 60,
	destination: 400
});

db.nodes.insert({
	id:"CH0004",
	location_x: 70,
	location_y: 80,
	destination: 500
});

db.nodes.insert({
	id:"CH0005",
	location_x: 90,
	location_y: 100,
	destination: 600
});

db.nodes.insert({
	id:"CH0006",
	location_x: 100,
	location_y: 145,
	destination: 700
});

// Paradas
db.stops.insert({
	id: "12340",
	location_x: 141,
	location_y: 36
});
db.stops.insert({
	id: "12341",
	location_x: 273,
	location_y: 36
});
db.stops.insert({
	id: "12342",
	location_x: 118,
	location_y: 165
});
db.stops.insert({
	id: "12343",
	location_x: 242,
	location_y: 165
});
db.stops.insert({
	id: "12344",
	location_x: 373,
	location_y: 165
});
db.stops.insert({
	id: "12345",
	location_x: 448,
	location_y: 165
});
db.stops.insert({
	id: "12346",
	location_x: 525,
	location_y: 168
});
db.stops.insert({
	id: "12347",
	location_x: 614,
	location_y: 168
});
db.stops.insert({
	id: "12348",
	location_x: 273,
	location_y: 302
});
db.stops.insert({
	id: "12349",
	location_x: 141,
	location_y: 302
});

// Tiendas
db.shops.insert({
	id: "234537744289",
	name: "Jack and Jones",
	url_image:"https://marinedacity.com/store-photos/jack-jones.jpg",
	product_name: "Ropa",
	location_x:102,
	location_y:145,
	type: "Ropa",
	promotions:[ {
			offer: "10% en camisetas"
		},
		{
			offer: "2x1 en pantalones"
		}]
	});

db.shops.insert({
	id: "18468259592",
	name: "The Coffee House",
	url_image:"https://doanhnghiepvietnam.org/img_duhoc/images/15029_TheCoffeeHouse.jpg",
	product_name: "Desayuno",
	location_x:53,
	location_y:45,
	type: "Restauración",
	promotions:[ {
			offer: "Café del dia por sólo 1.60€"
		}]
	});

db.shops.insert({
	id: "6280579817",
	name: "Starbucks",
	url_image:"https://www.mundofranquicia.com/wp-content/uploads/2018/06/starbuc.jpg",
	product_name: "Desayuno",
	location_x:69,
	location_y:20,
	type: "Restauración",
	promotions:[ {
			offer: "15% descuento en tu segundo café"
		}]
	});

db.shops.insert({
	id: "801982870",
	name: "Pepe Jeans",
	url_image:"https://upload.wikimedia.org/wikipedia/commons/5/56/Pepejeans.jpg",
	product_name: "Ropa",
	location_x:62,
	location_y:33,
	type: "Ropa",
	promotions:[ {
			offer: "SÓLO HOY: 10% de descuento en pantalones"
		}]
	});

db.shops.insert({
	id: "824648593",
	name: "Burger King",
	url_image: "https://www.aeroportofaro.pt/sites/default/files/media/burger_king_faro.jpg",
	product_name: "Desayuno",
	location_x:82,
	location_y:33,
	type: "Restauración",
	promotions:[ {
			offer:"2x1 en menú Whopper"
		},
		{
			offer:"Aros de cebolla gratis con tu menú grande"
		}]
	});


db.shops.insert({
	id: "251877523",
	name: "Tommy Hilfiger",
	url_image: "https://www.modaes.com/files/000_2016/tommy%20hilfiger/tommy-hilfiger-tienda-aeropuerto-india-948.jpg",
	product_name: "Ropa",
	location_x:122,
	location_y:33,
	type: "Ropa",
	promotions:[ {
			offer: "15% de descuento en camisas"
		}]
	});

db.shops.insert({
	id: "6386206655",
	name: "Nike",
	url_image:"https://www.marketingdirecto.com/wp-content/uploads/2018/03/nike-el-corte-ingl%C3%A9s.jpg",
	product_name: "Calzado",
	location_x:162,
	location_y:33,
	type: "Ropa",
	promotions:[ {
			offer: "5% de descuento con Carnet Jove"
		}]
	});

db.shops.insert({
	id: "251754823",
	name: "Adidas",
	url_image: "https://www.mataro-parc.com/sites/default/files/field/image/adidas.jpg",
	product_name: "Calzado",
	location_x:162,
	location_y:33,
	type: "Ropa",
	promotions:[ {
			offer: "ÚLTIMAS TALLAS: Adidas Classic por sólo 45€"
		}]
	});

// Vuelos

db.flights.insert({
    name: "QR6213",
    airline: "QATAR Airways",
    from: "Vilanova T2",
    to: "Doha",
    type: "Salida",
    boarding_time: "18:30",
    departure_time: "19:10",
    arrival_time: "21:30",
    date: "2020-06-18",
    gate: {
      name: "VI04",
      location_x: 50,
      location_y: 50,
    }
});

db.flights.insert({
   	name: "VY2104",
    	airline: "Vueling",
    	from: "Vilanova T2",
   	to: "Berlin",
    	departure_time: "10:00",
    	arrival_time: "12:00",
    	boarding_time: "09:30",
    	date: "2020-06-18",
	type: "Salida",
	gate: {
		name: "VI11",
      		location_x: 11,
      		location_y: 11
    	}
});

db.flights.insert({
   	name: "VL0204",
    	airline: "Vilanova Airlines",
    	from: "Marrakech",
   	to: "Vilanova T2",
	type: "Llegada",
    	departure_time: "15:00",
    	arrival_time: "17:00",
    	boarding_time: "16:30",
    	date: "2020-06-18",
	gate: {
		name: "MK123",
      		location_x: 47,
      		location_y: 147
    	}
});
