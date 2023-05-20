const { exec, delay, readCommand } = require('./util');
const { 
  evalId,
  challengesFolder: dockerDir, 
  containerWorkDir: workDir,
  testsFolder,
  defaultDelay 
} = require('./constants');

global.beforeAll(async () => {
  await exec(`docker rm -fv $(docker ps -qaf name=trybe-eval-)`)
    .catch(() => true);

  await exec([
    "docker run",
      `--name ${evalId}`,
      "--privileged",
      "-d",
      `-w ${workDir}`,
      `-v ${dockerDir}:${workDir}`,
      `-v ${testsFolder}/schemas:${workDir}/schemas`,
      "betrybe/docker-todo-list:1.1"
  ].join(" "));

  await delay(defaultDelay);
});

global.afterAll(async () => {
  await exec(`docker rm -fv $(docker ps -qaf name=trybe-eval-)`)
    .catch(() => true);
});

global.expect.extend({

  async toPassStructureTest(imageName, imageSchema) {
    try {
      await readCommand(false, `container-structure-test test --output json --image ${imageName} --config ./schemas/${imageSchema}`);
      return { pass: true, message: () => `expected image ${imageName} to fail ${imageSchema} tests`}
    } catch (error) {
      return { pass: false, message: () => formatCSTOutput(error.stdout)}
    }

    function formatCSTOutput(stdout) {
      const { Results } = JSON.parse(stdout)
      return Results
        .filter(result => result.Pass === false)
        .flatMap(error => error.Errors)
        .map(formatTestError)
        .join('\n')
    }

    function formatTestError(error, index) {
      return `\t${index + 1}. ${error}`
    }
  },

})