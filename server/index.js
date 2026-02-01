const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'masa_madre_token_2024';
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

const DATA_PATH = path.join(__dirname, 'data', 'incoming_orders.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, JSON.stringify([]));
}

// Minimal Parser Helper (Sync with Frontend waParser.js logic)
const parseMessage = (text) => {
    const items = [];
    const customerMatch = text.match(/(?:soy|me llamo|hola,? soy|atentamente|saludos,?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    const customer = customerMatch ? customerMatch[1] : "Cliente WhatsApp";

    const products = [
        { id: '1', name: 'Pan de Masa Madre' },
        { id: '2', name: 'Focaccia Romana' },
        { id: '3', name: 'Croissant x3' }
    ];

    products.forEach(p => {
        const regex = new RegExp(`(?:(\\d+)\\s*)?${p.name}(?:\\s*x?\\s*(\\d+))?`, 'gi');
        let match;
        while ((match = regex.exec(text)) !== null) {
            items.push({
                productId: p.id,
                name: p.name,
                quantity: parseInt(match[1] || match[2] || "1")
            });
        }
    });

    return { customer, items, isValid: items.length > 0 };
};

// Webhook Verification (for Meta)
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});

// Receive WhatsApp Messages
app.post('/webhook', async (req, res) => {
    const body = req.body;
    if (body.object) {
        if (body.entry && 
            body.entry[0].changes && 
            body.entry[0].changes[0].value.messages && 
            body.entry[0].changes[0].value.messages[0]
        ) {
            const msg = body.entry[0].changes[0].value.messages[0];
            const from = msg.from;
            const text = msg.text ? msg.text.body : '';

            const parsed = parseMessage(text);
            if (parsed.isValid) {
                const incoming = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
                incoming.push({
                    id: `wa-${Date.now()}`,
                    customer: parsed.customer,
                    phone: from,
                    items: parsed.items,
                    date: new Date().toISOString(),
                    raw: text,
                    status: 'PENDING_REVIEW'
                });
                fs.writeFileSync(DATA_PATH, JSON.stringify(incoming, null, 2));
            }
        }
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
});

app.get('/api/incoming', (req, res) => {
    const incoming = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    res.json(incoming);
});

app.post('/api/review-action', (req, res) => {
    const { id, action } = req.body;
    let incoming = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    if (action === 'dismiss' || action === 'approve') {
        incoming = incoming.filter(order => order.id !== id);
        fs.writeFileSync(DATA_PATH, JSON.stringify(incoming, null, 2));
    }
    res.json({ success: true });
});

app.post('/send-message', async (req, res) => {
    const { to, text } = req.body;
    try {
        const response = await axios({
            method: 'POST',
            url: `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
            data: {
                messaging_product: 'whatsapp',
                to: to,
                type: 'text',
                text: { body: text }
            },
            headers: {
                'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
});
