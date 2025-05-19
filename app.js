const express = require('express');
const si = require('systeminformation');
const cors = require('cors'); // Importa o pacote cors


const app = express();
const port = 3001;

app.use(cors());


app.get('/', (req, res) => {
  res.send({ message: 'API de monitoramento de hardware em tempo real com Node.js' });
});

app.get('/cpu', async (req, res) => {
  const load = await si.currentLoad();
  const cpu = await si.cpu();
  const mem = await si.mem();
  const disk = await si.fsSize();
  const osInfo = await si.osInfo();
  const time = await si.time();

  res.json({
    manufacturer: cpu.manufacturer,
    brand: cpu.brand,
    speed: cpu.speed,
    cores: cpu.cores,
    physicalCores: cpu.physicalCores,
    total: mem.total,
    used: mem.used,
    free: mem.free,
    active: mem.active,
    available: mem.available,
    fs: disk.fs,
    type: disk.type,
    size: disk.size,
    used: disk.used,
    use: disk.use + '%',
    mount: disk.mount,
    platform: osInfo.platform,
    distro: osInfo.distro,
    release: osInfo.release,
    hostname: osInfo.hostname,
    uptime: time.uptime
  });
});

app.get('/memory', async (req, res) => {
  const mem = await si.mem();
  res.json({
    total: mem.total,
    used: mem.used,
    free: mem.free,
    active: mem.active,
    available: mem.available
  });
});

app.get('/disk', async (req, res) => {
  const disk = await si.fsSize();
  res.json(disk.map(d => ({
    fs: d.fs,
    type: d.type,
    size: d.size,
    used: d.used,
    use: d.use + '%',
    mount: d.mount
  })));
});

app.get('/system', async (req, res) => {
  const osInfo = await si.osInfo();
  const time = await si.time();
  res.json({
    platform: osInfo.platform,
    distro: osInfo.distro,
    release: osInfo.release,
    hostname: osInfo.hostname,
    uptime: time.uptime
  });
});


app.get('/cpu/temperature', async (req, res) => {
    try {
      const temperature = await si.cpuTemperature();
      res.json({
        main: temperature.main, // Temperatura principal da CPU
        cores: temperature.cores // Temperatura individual dos núcleos (se disponível)
      });
    } catch (err) {
      res.status(500).json({ error: "Não foi possível obter a temperatura da CPU" });
    }
  });

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});