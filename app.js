const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 3000;

const API_TOKEN = "HIx85eDKB6U41TXJZwEjW0GVsPnMchYS";
const MEMBER_ID = "EA0xZBsO";
const BASE_URL = "https://jualpulsaaja.com/api/main_v3";

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Route untuk mendapatkan daftar produk (pastikan endpoint ini ada)
app.get('/api/produk', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/produk?memberID=${MEMBER_ID}&password=${API_TOKEN}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server: ' + error.message });
    }
});

// Route untuk membeli pulsa
app.post('/api/beli-pulsa', async (req, res) => {
    const { phone, product } = req.body;
    
    const trxid = crypto.randomBytes(16).toString('hex');
    const url = `${BASE_URL}/trx?memberID=${MEMBER_ID}&product=${product}&dest=${phone}&refID=${trxid}&password=${API_TOKEN}`;

    try {
        const response = await axios.get(url);
        
        if (response.data.status === 'SUCCESS') {
            res.json({ message: 'Pulsa berhasil dibeli!' });
        } else {
            res.status(400).json({ message: 'Transaksi gagal: ' + response.data.message });
        }
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan pada server: ' + error.message });
    }
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
