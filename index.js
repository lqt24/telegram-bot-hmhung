const logger = require("./utils/log");
const http = require("http");
const { spawn, exec } = require('child_process');

const dashboard = http.createServer(function (_req, res) {
    res.writeHead(200, "OKay", { "Content-Type": "text/html" });
    res.write("Hello from Delta :>");
    res.end();
});

const port = process.env.PORT || 6788;
dashboard.listen(port, () => {
    logger(`Server is running on http://localhost:${port}`);
});

function startBot(message) {
    (message) ? logger(message, "『 starting 』 →") : "";

    const child = spawn("node", ["--trace-warnings", "--async-stack-traces", "delta.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (codeExit) => {
        if (codeExit != 0 || global.countRestart && global.countRestart < 5) {
            startBot("Restarting...");
            global.countRestart += 1;
            return;
        } else return;
    });

    child.on("error", function (error) {
        logger("An error occurred: " + JSON.stringify(error), "『 starting 』 →");
    });
}

startBot();