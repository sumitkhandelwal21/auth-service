import cluster from "cluster";
import os from "os";

const workers = Number(process.env.WEB_CONCURRENCY ?? os.cpus().length);

if (cluster.isPrimary) {
  console.log(`Primary starting ${workers} workers [pid:${process.pid}]`);
  for (let i = 0; i < workers; i++) {
    const w = cluster.fork();
    console.log(`Forked worker id=${w.id} [pid:${w.process.pid}]`);
  }
  cluster.on("online", (worker) => {
    console.log(`Worker online id=${worker.id} [pid:${worker.process.pid}]`);
  });
  cluster.on("listening", (worker, address) => {
    console.log(
      `Worker listening id=${worker.id} [pid:${worker.process.pid}] ${address.address}:${address.port}`
    );
  });
  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker exited id=${worker.id} [pid:${worker.process.pid}] code=${code} signal=${signal}`
    );
    const w = cluster.fork();
    console.log(`Respawned worker id=${w.id} [pid:${w.process.pid}]`);
  });
} else {
  console.log(`Worker starting [pid:${process.pid}]`);
  require("./index");
}
