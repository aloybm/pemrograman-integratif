const mqtt = require('mqtt');
const sql = require('mssql');

const config = {
    user: 'integratif',
    password: 'G3rb4ng!',
    server: '10.199.14.47',
    database: 'GATE_DEV',
    options: {
        encrypt: true, 
        trustServerCertificate: true 
    },  
  }

  const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool =>{
      console.log("Connected to MSSQL");
      return pool;
  })
  .catch(err => {
      console.log("Database Connection Failed! Bad Config: ", err)
  })

// Mqtt setup
const client  = mqtt.connect('mqtt://localhost:1883');

client.on('connect', function () {
    console.log('Connected to MQTT broker.');

    // Subscribe to topics
    client.subscribe('masuk', function (err) {
        if (err) {
            console.log(err);
        }
    });

    client.subscribe('keluar', function (err) {
        if (err) {
            console.log(err);
        }
    });
});

client.on('message', async function (topic, message) {
    console.log(`${message.toString()}`);

    try {
        const data = JSON.parse(message.toString());

        if (topic === 'masuk') {
            const result = await masuk(data.idkartu, data.idgate);
            client.publish('masuk/result', result.toString());
            console.log(`${result}`)
        } else if (topic === 'keluar') {
            const result = await keluar(data.idkartu, data.idgate);
            client.publish('keluar/result', JSON.parse(result.toString()));
            console.log(`${result}`)
        }
    } catch (err) {
        console.log(`Error processing message: ${err}`);
    }
});

async function insertlog(idKartu, idGate, cek, is_valid) {
    let table;
    if (cek == 'MASUK') table = 'log_masuk';
    else table = 'log_keluar';
    const query = `INSERT INTO ${table} (id_kartu_akses, id_register_gate, is_valid) VALUES ('${idKartu}', ${idGate}, ${is_valid})`;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query(query);
        console.log(`Aktivitas ${cek} berhasil dicatat.`);
        return result;
    } catch (err) {
        console.log(`Gagal mencatat aktivitas ${cek}: ${err}`);
        throw err;
    }
}

async function masuk(idkartu, idgate) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('idkartu', idkartu)
            .query(`SELECT * FROM kartu_akses WHERE id_kartu_akses = '${idkartu}'`);
        const result2 = await pool.request()
            .input('idgate', idgate)
            .query(`SELECT * FROM register_gate WHERE id_register_gate = '${idgate}'`);

        if (result.recordset.length === 0 || result2.recordset.length === 0) {
            // console.log("Invalid idgate or idkartu ");
            return '0';
        } else if (result.recordset[0].is_aktif == 1) {
            insertlog(idkartu, idgate, "MASUK", 1);
            return '1';
        } else if (result.recordset[0].is_aktif == 0 ) {
            insertlog(idkartu, idgate,"MASUK", 0);
            return '0';
        }

    } catch(err){
        console.log(err);
    }
}


async function keluar(idkartu, idgate) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('idkartu', idkartu)
            .query(`SELECT * FROM kartu_akses WHERE id_kartu_akses = '${idkartu}'`);
        const result2 = await pool.request()
            .input('idgate', idgate)
            .query(`SELECT * FROM register_gate WHERE id_register_gate = '${idgate}'`);

        if (result.recordset.length === 0 || result2.recordset.length === 0) {
            // console.log("Invalid idgate or idkartu ");
            return '0';
        } else if (result.recordset[0].is_aktif == 1) {
            insertlog(idkartu, idgate, "KELUAR", 1);
            return '1';
        } else if (result.recordset[0].is_aktif == 0) {
            insertlog(idkartu, idgate, "KELUAR", 0);
            return '0';
        }
    } catch(err){
        console.log(err);
    }
}
