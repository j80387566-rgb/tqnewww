// ---- LISTA COMPLETA DE AEROPUERTOS DE COLOMBIA ----
const ciudades = [
    { id:"400", displayText:"Armenia (AXM)", code:"AXM", country:"CO" },
    { id:"402", displayText:"Barranquilla (BAQ)", code:"BAQ", country:"CO" },
    { id:"403", displayText:"Bogotá (BOG)", code:"BOG", country:"CO" },
    { id:"404", displayText:"Bucaramanga (BGA)", code:"BGA", country:"CO" },
    { id:"405", displayText:"Cali (CLO)", code:"CLO", country:"CO" },
    { id:"406", displayText:"Cartagena (CTG)", code:"CTG", country:"CO" },
    { id:"408", displayText:"Cúcuta (CUC)", code:"CUC", country:"CO" },
    { id:"410", displayText:"Ibagué (IBE)", code:"IBE", country:"CO" },
    { id:"413", displayText:"Manizales (MZL)", code:"MZL", country:"CO" },

    { id:"414", displayText:"Medellín - José María Córdova (MDE)", code:"MDE", country:"CO" },
    { id:"415", displayText:"Medellín - Olaya Herrera (EOH)", code:"EOH", country:"CO" },
    { id:"416", displayText:"Montería (MTR)", code:"MTR", country:"CO" },
    { id:"417", displayText:"Neiva (NVA)", code:"NVA", country:"CO" },
    { id:"418", displayText:"Pasto (PSO)", code:"PSO", country:"CO" },
    { id:"419", displayText:"Pereira (PEI)", code:"PEI", country:"CO" },
    { id:"420", displayText:"Popayán (PPN)", code:"PPN", country:"CO" },
    { id:"421", displayText:"Puerto Asís (PUU)", code:"PUU", country:"CO" },
    { id:"422", displayText:"Quibdó (UIB)", code:"UIB", country:"CO" },

    { id:"423", displayText:"Riohacha (RCH)", code:"RCH", country:"CO" },
    { id:"424", displayText:"San Andrés (ADZ)", code:"ADZ", country:"CO" },
    { id:"425", displayText:"San José del Guaviare (SJE)", code:"SJE", country:"CO" },
    { id:"426", displayText:"Santa Marta (SMR)", code:"SMR", country:"CO" },
    { id:"427", displayText:"Tame (TME)", code:"TME", country:"CO" },
    { id:"428", displayText:"Tumaco (TCO)", code:"TCO", country:"CO" },
    { id:"429", displayText:"Valledupar (VUP)", code:"VUP", country:"CO" },
    { id:"430", displayText:"Villavicencio (VVC)", code:"VVC", country:"CO" },
    { id:"431", displayText:"Yopal (EYP)", code:"EYP", country:"CO" }
];

// ---- FUNCIÓN BUSCADOR (equivalente al PHP) ----
function buscar(query) {
    if (!query) return [];
    query = query.toLowerCase();
    return ciudades.filter(ciudad =>
        ciudad.displayText.toLowerCase().includes(query)
    );
}

// ---- RESPUESTA DEL “SERVIDOR” (WebWorker) ----
onmessage = (e) => {
    const query = e.data.query;
    postMessage(buscar(query));
};