// Importa los módulos necesarios
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');     // Agregado para manejar el archivo de vuelos
const cors = require('cors'); // Agregado para permitir peticiones cruzadas

// Carga las variables de entorno desde el archivo .env
dotenv.config();

// Crea una instancia de la aplicación Express
const app = express();
const http = require('http');
// Creamos un servidor HTTP a partir del app para usar con socket.io
const server = http.createServer(app);

// Puerto configurable desde variable de entorno o 3000 por defecto
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Permitir CORS
app.use(express.json()); // Parsear JSON en el body

// Middleware para servir los archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// ---------------------------------------------------------
// CONFIGURACIÓN DE VUELOS Y AEROPUERTOS
// ---------------------------------------------------------

// Ruta al archivo 'vuelos' que se actualizará con las búsquedas
const vuelosFilePath = path.join(__dirname, 'vuelos');

// Lista completa de aeropuertos de Colombia
const ciudadesDisponibles = [
    {
        "id": "403",
        "displayText": "Bogotá (BOG)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Bogotá</em> (BOG)",
        "type": 0,
        "isActive": true,
        "code": "BOG",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "6789ebcf893c0", "queryID": "6789ebcf893c2" }
    },
    {
        "id": "414",
        "displayText": "Medellín - J.M. Córdova (MDE)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Medellín</em> (MDE)",
        "type": 0,
        "isActive": true,
        "code": "MDE",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "678c09aaad233", "queryID": "678c09aaad236" }
    },
    {
        "id": "499",
        "displayText": "Medellín - Olaya Herrera (EOH)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Medellín</em> (EOH)",
        "type": 0,
        "isActive": true,
        "code": "EOH",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "eoh_obj_id", "queryID": "eoh_qry_id" }
    },
    {
        "id": "405",
        "displayText": "Cali (CLO)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Cali</em> (CLO)",
        "type": 0,
        "isActive": true,
        "code": "CLO",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "67894b7f85d84", "queryID": "67894b7f85d87" }
    },
    {
        "id": "406",
        "displayText": "Cartagena (CTG)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Cartagena</em> (CTG)",
        "type": 0,
        "isActive": true,
        "code": "CTG",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "67894aac26cb0", "queryID": "67894aac26cb2" }
    },
    {
        "id": "402",
        "displayText": "Barranquilla (BAQ)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Barranquilla</em> (BAQ)",
        "type": 0,
        "isActive": true,
        "code": "BAQ",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "6789d68db15aa", "queryID": "6789d68db15ac" }
    },
    {
        "id": "425",
        "displayText": "Santa Marta (SMR)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Santa</em> Marta (SMR)",
        "type": 0,
        "isActive": true,
        "code": "SMR",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "678948f654270", "queryID": "678948f654271" }
    },
    {
        "id": "423",
        "displayText": "San Andrés (ADZ)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>San</em> Andrés (ADZ)",
        "type": 0,
        "isActive": true,
        "code": "ADZ",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "678948f65425c", "queryID": "678948f65425f" }
    },
    {
        "id": "418",
        "displayText": "Pereira (PEI)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Pereira</em> (PEI)",
        "type": 0,
        "isActive": true,
        "code": "PEI",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "67894bb877a1a", "queryID": "67894bb877a1d" }
    },
    {
        "id": "404",
        "displayText": "Bucaramanga (BGA)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Bucaramanga</em> (BGA)",
        "type": 0,
        "isActive": true,
        "code": "BGA",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "67894bcc18a96", "queryID": "67894bcc18a98" }
    },
    {
        "id": "408",
        "displayText": "Cúcuta (CUC)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Cúcuta</em> (CUC)",
        "type": 0,
        "isActive": true,
        "code": "CUC",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "67894bec0ac9b", "queryID": "67894bec0ac9e" }
    },
    {
        "id": "415",
        "displayText": "Montería (MTR)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Montería</em> (MTR)",
        "type": 0,
        "isActive": true,
        "code": "MTR",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "67894c65b2c1a", "queryID": "67894c65b2c1c" }
    },
    {
        "id": "427",
        "displayText": "Valledupar (VUP)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Valledupar</em> (VUP)",
        "type": 0,
        "isActive": true,
        "code": "VUP",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "val_obj_id", "queryID": "val_qry_id" }
    },
    {
        "id": "422",
        "displayText": "Riohacha (RCH)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Riohacha</em> (RCH)",
        "type": 0,
        "isActive": true,
        "code": "RCH",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "67894cc34a553", "queryID": "67894cc34a555" }
    },
    {
        "id": "412",
        "displayText": "Leticia (LET)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Leticia</em> (LET)",
        "type": 0,
        "isActive": true,
        "code": "LET",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "let_obj_id", "queryID": "let_qry_id" }
    },
    {
        "id": "400",
        "displayText": "Armenia (AXM)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Armenia</em> (AXM)",
        "type": 0,
        "isActive": true,
        "code": "AXM",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "67894c83e7e4c", "queryID": "67894c83e7e4f" }
    },
    {
        "id": "413",
        "displayText": "Manizales (MZL)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Manizales</em> (MZL)",
        "type": 0,
        "isActive": true,
        "code": "MZL",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "67894c00795fe", "queryID": "67894c0079601" }
    },
    {
        "id": "416",
        "displayText": "Neiva (NVA)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Neiva</em> (NVA)",
        "type": 0,
        "isActive": true,
        "code": "NVA",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "67894c1f00d84", "queryID": "67894c1f00d86" }
    },
    {
        "id": "417",
        "displayText": "Pasto (PSO)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Pasto</em> (PSO)",
        "type": 0,
        "isActive": true,
        "code": "PSO",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "pso_obj_id", "queryID": "pso_qry_id" }
    },
    {
        "id": "410",
        "displayText": "Ibagué (IBE)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Ibagué</em> (IBE)",
        "type": 0,
        "isActive": true,
        "code": "IBE",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "67894c9a4e319", "queryID": "67894c9a4e31b" }
    },
    {
        "id": "409",
        "displayText": "Florencia (FLA)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Florencia</em> (FLA)",
        "type": 0,
        "isActive": true,
        "code": "FLA",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "fla_obj_id", "queryID": "fla_qry_id" }
    },
    {
        "id": "429",
        "displayText": "Yopal (EYP)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Yopal</em> (EYP)",
        "type": 0,
        "isActive": true,
        "code": "EYP",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "eyp_obj_id", "queryID": "eyp_qry_id" }
    },
    {
        "id": "401",
        "displayText": "Arauca (AUC)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Arauca</em> (AUC)",
        "type": 0,
        "isActive": true,
        "code": "AUC",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "auc_obj_id", "queryID": "auc_qry_id" }
    },
    {
        "id": "419",
        "displayText": "Popayán (PPN)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Popayán</em> (PPN)",
        "type": 0,
        "isActive": true,
        "code": "PPN",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "67894c4b50200", "queryID": "67894c4b50202" }
    },
    {
        "id": "426",
        "displayText": "Tumaco (TCO)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Tumaco</em> (TCO)",
        "type": 0,
        "isActive": true,
        "code": "TCO",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "67894cb07315e", "queryID": "67894cb073161" }
    },
    {
        "id": "407",
        "displayText": "Corozal (CZU)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Corozal</em> (CZU)",
        "type": 0,
        "isActive": true,
        "code": "CZU",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "czu_obj_id", "queryID": "czu_qry_id" }
    },
    {
        "id": "430",
        "displayText": "Apartadó (APO)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Apartadó</em> (APO)",
        "type": 0,
        "isActive": true,
        "code": "APO",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "apo_obj_id", "queryID": "apo_qry_id" }
    },
    {
        "id": "431",
        "displayText": "Bahía Solano (BSC)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Bahía</em> Solano (BSC)",
        "type": 0,
        "isActive": true,
        "code": "BSC",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "bsc_obj_id", "queryID": "bsc_qry_id" }
    },
    {
        "id": "432",
        "displayText": "Puerto Carreño (PCR)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Puerto</em> Carreño (PCR)",
        "type": 0,
        "isActive": true,
        "code": "PCR",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "pcr_obj_id", "queryID": "pcr_qry_id" }
    },
    {
        "id": "433",
        "displayText": "Quibdó (UIB)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Quibdó</em> (UIB)",
        "type": 0,
        "isActive": true,
        "code": "UIB",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "uib_obj_id", "queryID": "uib_qry_id" }
    },
    {
        "id": "434",
        "displayText": "Guapi (GPI)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Guapi</em> (GPI)",
        "type": 0,
        "isActive": true,
        "code": "GPI",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "gpi_obj_id", "queryID": "gpi_qry_id" }
    },
    {
        "id": "435",
        "displayText": "Mitú (MVP)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Mitú</em> (MVP)",
        "type": 0,
        "isActive": true,
        "code": "MVP",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "mvp_obj_id", "queryID": "mvp_qry_id" }
    },
    {
        "id": "436",
        "displayText": "Saravena (RVE)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Saravena</em> (RVE)",
        "type": 0,
        "isActive": true,
        "code": "RVE",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "rve_obj_id", "queryID": "rve_qry_id" }
    },
    {
        "id": "424",
        "displayText": "San José del Guaviare (SJE)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>San</em> José del Guaviare (SJE)",
        "type": 0,
        "isActive": true,
        "code": "SJE",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "678948f65426e", "queryID": "678948f65426f" }
    },
    {
        "id": "437",
        "displayText": "Trinidad (TDA)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Trinidad</em> (TDA)",
        "type": 0,
        "isActive": true,
        "code": "TDA",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "tda_obj_id", "queryID": "tda_qry_id" }
    },
    {
        "id": "428",
        "displayText": "Villavicencio (VVC)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Villavicencio</em> (VVC)",
        "type": 0,
        "isActive": true,
        "code": "VVC",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "67894c37d0633", "queryID": "67894c37d0637" }
    },
    {
        "id": "438",
        "displayText": "Villagarzón (VGZ)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Villagarzón</em> (VGZ)",
        "type": 0,
        "isActive": true,
        "code": "VGZ",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "vgz_obj_id", "queryID": "vgz_qry_id" }
    },
    {
        "id": "439",
        "displayText": "Puerto Asís (PUU)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Puerto</em> Asís (PUU)",
        "type": 0,
        "isActive": true,
        "code": "PUU",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "puu_obj_id", "queryID": "puu_qry_id" }
    },
    {
        "id": "440",
        "displayText": "Puerto Inírida (PDA)",
        "displayDestinationHtml": "Colombia",
        "displayHtml": "<em>Puerto</em> Inírida (PDA)",
        "type": 0,
        "isActive": true,
        "code": "PDA",
        "country": "CO",
        "positions": 1,
        "items": { "hotel": 0, "objectID": "pda_obj_id", "queryID": "pda_qry_id" }
    }
];

// ---------------------------------------------------------
// RUTAS DE TELEGRAM
// ---------------------------------------------------------

// Endpoint para enviar mensajes a Telegram de forma segura
app.post('/api/send-message', async (req, res) => {
    // 'keyboard' se recibe correctamente del frontend
    const { text, keyboard } = req.body; 

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chat_id = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chat_id) {
        return res.status(500).json({ error: 'Las variables de entorno de Telegram no están configuradas en el servidor.' });
    }

    if (!text) {
        return res.status(400).json({ error: 'El texto del mensaje es requerido.' });
    }

    try {
        // Usamos fetch (disponible en Node.js 18+) para comunicarnos con la API de Telegram
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chat_id,
                text: text,
                // 'reply_markup' espera el objeto 'keyboard' que le mandaste
                reply_markup: keyboard, 
            }),
        });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Error al enviar mensaje a Telegram:', error);
        res.status(500).json({ error: 'Error interno del servidor al contactar a Telegram.' });
    }
});

// Endpoint seguro para verificar la respuesta (callback) de Telegram
app.get('/api/check-update/:messageId', async (req, res) => {
    const { messageId } = req.params;
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chat_id = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chat_id) {
        return res.status(500).json({ error: 'Variables de entorno de Telegram no configuradas.' });
    }

    let updateFound = false;
    const startTime = Date.now();
    const timeout = 600000; // 60 segundos de espera máxima (esto son 10 minutos, corregir si deseas 60s)

    // Variable para el offset de getUpdates
    let lastUpdateId = 0;

    // Bucle de "Long Polling"
    while (Date.now() - startTime < timeout && !updateFound) {
        try {
            // Usamos un offset para pedir a Telegram solo actualizaciones nuevas
            const response = await fetch(`https://api.telegram.org/bot${token}/getUpdates?offset=${lastUpdateId + 1}&limit=1`);
            const data = await response.json();

            if (data.ok && data.result.length > 0) {
                // Busca la actualización de callback que coincida con nuestro ID de mensaje
                const relevantUpdate = data.result.find(
                    (update) =>
                    update.callback_query &&
                    update.callback_query.message.message_id == messageId
                );

                // Actualizamos el offset para la próxima petición, incluso si no es nuestro mensaje
                lastUpdateId = data.result[data.result.length - 1].update_id;

                if (relevantUpdate) {
                    updateFound = true;
                    const callbackQuery = relevantUpdate.callback_query;
                    const action = callbackQuery.data.split(':')[0];
                    const user = callbackQuery.from;
                    const userName = user.username ? `@${user.username}` : `${user.first_name} ${user.last_name || ''}`.trim();

                    // Responde a Telegram para que sepa que recibimos el callback
                    await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ callback_query_id: callbackQuery.id })
                    });

                    // Eliminar los botones del mensaje en Telegram
                    await fetch(`https://api.telegram.org/bot${token}/editMessageReplyMarkup`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chat_id,
                            message_id: messageId,
                            reply_markup: { inline_keyboard: [] } // Un teclado vacío
                        }),
                    });

                    // Enviar notificación al chat de Telegram
                    const notificationText = `${userName} eligió la acción: ${action}.`;
                    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chat_id: chat_id,
                            text: notificationText,
                        }),
                    });

                    // Enviar la acción al frontend
                    return res.json({ action });
                }
            }
        } catch (error) {
            console.error('Error durante el polling:', error);
            // Esperar antes de reintentar para no saturar en caso de error de red
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
        // Esperar 2 segundos antes de la siguiente verificación
        if (!updateFound) await new Promise(resolve => setTimeout(resolve, 2000));
    }
    // Si se agota el tiempo, enviar una respuesta de timeout
    return res.status(408).json({ error: 'Timeout: No se recibió respuesta del operador.' });
});

// ---------------------------------------------------------
// RUTAS DE BÚSQUEDA DE AEROPUERTOS (INTEGRADO)
// ---------------------------------------------------------

app.post('/buscar-ciudad', (req, res) => {
    const { query } = req.body; // Extraemos la consulta de la solicitud

    console.log('Búsqueda recibida:', query);

    if (!query) {
        return res.json([]);
    }

    // Filtrar ciudades por la consulta
    const ciudadesFiltradas = ciudadesDisponibles.filter(ciudad =>
        ciudad.displayText.toLowerCase().includes(query.toLowerCase())
    );

    console.log('Ciudades encontradas:', ciudadesFiltradas.length);

    // Si hay resultados, actualizamos el archivo 'vuelos'
    if (ciudadesFiltradas.length > 0) {
        // Limpiamos el archivo 'vuelos' antes de agregar nuevas ciudades
        fs.writeFile(vuelosFilePath, JSON.stringify([]), 'utf8', (err) => {
            if (err) {
                console.log('Error al limpiar el archivo vuelos:', err);
                return res.status(500).json({ error: 'No se pudo limpiar el archivo vuelos' });
            }

            // Ordenar las ciudades encontradas por relevancia
            // 1. Coincidencia exacta al inicio
            // 2. Coincidencia en cualquier parte
            const ciudadesOrdenadas = ciudadesFiltradas.sort((a, b) => {
                const queryLower = query.toLowerCase();
                const aStarts = a.displayText.toLowerCase().startsWith(queryLower);
                const bStarts = b.displayText.toLowerCase().startsWith(queryLower);

                if (aStarts && !bStarts) return -1;
                if (!aStarts && bStarts) return 1;
                return 0;
            });

            // Escribimos el archivo actualizado con las ciudades ordenadas
            fs.writeFile(vuelosFilePath, JSON.stringify(ciudadesOrdenadas, null, 2), 'utf8', (err) => {
                if (err) {
                    console.log('Error al escribir en el archivo vuelos:', err);
                    return res.status(500).json({ error: 'No se pudo actualizar el archivo vuelos' });
                }
                console.log('Archivo vuelos actualizado con ciudades ordenadas');

                res.json(ciudadesOrdenadas); // Devolvemos las ciudades ordenadas
            });
        });
    } else {
        res.json([]); // Si no se encuentra ninguna ciudad, devolvemos un arreglo vacío
    }
});


// ---------------------------------------------------------
// SOCKET.IO
// ---------------------------------------------------------

const { Server } = require('socket.io');
const io = new Server(server, {
    cors: { origin: '*' }
});

// Mapa con sockets conectados para información más detallada
const connected = new Map();
// Contador de visitas totales (en memoria). Reinicia al reiniciar el servidor.
let totalVisits = 0;
// Lista de las visitas recientes (máx 200)
const recentVisits = [];

io.on('connection', (socket) => {
    const now = Date.now();
    connected.set(socket.id, { connectedAt: now });

    // Nuevo "visitante" que carga la página / establece socket: incrementamos totalVisits
    totalVisits++;
    // Guardamos en historial de visitas (más reciente primero)
    recentVisits.unshift({ id: socket.id, at: now });
    if (recentVisits.length > 200) recentVisits.length = 200;

    const onlineCount = connected.size;
    // Emitimos estadísticas completas
    const stats = {
        online: onlineCount,
        totalVisits,
        recentVisits: recentVisits.slice(0, 100),
        clients: Array.from(connected.entries()).map(([id, info]) => ({ id, connectedAt: info.connectedAt }))
    };
    io.emit('stats', stats);
    io.emit('count', onlineCount);
    io.emit('details', { count: onlineCount, clients: stats.clients });

    // Permitir que un cliente solicite los detalles bajo demanda
    socket.on('request-details', () => {
        const current = connected.size;
        socket.emit('details', {
            count: current,
            clients: Array.from(connected.entries()).map(([id, info]) => ({ id, connectedAt: info.connectedAt }))
        });
    });

    socket.on('disconnect', () => {
        connected.delete(socket.id);
        const newCount = connected.size;
        const statsAfter = {
            online: newCount,
            totalVisits,
            recentVisits: recentVisits.slice(0, 100),
            clients: Array.from(connected.entries()).map(([id, info]) => ({ id, connectedAt: info.connectedAt }))
        };
        io.emit('stats', statsAfter);
        io.emit('count', newCount);
        io.emit('details', { count: newCount, clients: statsAfter.clients });
    });
});

// ---------------------------------------------------------
// CATCH-ALL ROUTE (SPA)
// ---------------------------------------------------------
// Esta ruta debe ir AL FINAL, después de todas las rutas de API
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

