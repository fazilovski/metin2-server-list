const fs = require('fs');
const http = require('http');
const { MongoClient } = require('mongodb');

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

let db;

async function baglan() {
    try {
        await client.connect();
        db = client.db("metin2");
        console.log("MongoDB bağlandı");
    } catch (err) {
        console.log("MongoDB HATA:", err.message);
    }
}

const server = http.createServer(async (req, res) => {

    if (req.url === "/") {
        fs.readFile("index.html", (err, data) => {
            res.setHeader("Content-Type", "text/html; charset=utf-8");
            res.end(data);
        });
        return;
    }

    res.setHeader("Content-Type", "application/json");

    if (req.method === "GET" && req.url.startsWith("/serverlar")) {
        let serverlar = await db.collection("serverlar").find().toArray();
        res.end(JSON.stringify(serverlar));
    }

    else if (req.method === "POST" && req.url.startsWith("/ekle")) {

        let body = "";

        req.on("data", chunk => {
            body += chunk.toString();
        });

        req.on("end", async () => {
            const veri = JSON.parse(body);

            await db.collection("serverlar").insertOne({ ad: veri.ad });

            res.end(JSON.stringify({ mesaj: "Eklendi" }));
        });
    }

});


// 🔥 EN KRİTİK KISIM BURASI
(async () => {
    await baglan();

    server.listen(3000, () => {
        console.log("Server çalıştı: http://localhost:3000");
    });
})();