import cluster from "cluster";
import os from "os";

const workers = Number(process.env.WEB_CONCURRENCY ?? os.cpus().length);

if (cluster.isPrimary) {
  for (let i = 0; i < workers; i++) {
    cluster.fork();
  }
  cluster.on("exit", () => {
    cluster.fork();
  });
} else {
  require("./index");
}
