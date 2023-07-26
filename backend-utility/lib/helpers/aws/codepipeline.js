/**
 *  Implementation of helper methods related AWS CodePipeline
 */

const aws = require('aws-sdk');

const { REGION } = process.env;

/**
* Execute codepipeline
* @param {String} pipelineName
*/
async function startPipelineExecution(pipelineName) {
  const codePipeline = new aws.CodePipeline({ region: REGION });
  const response = await codePipeline.startPipelineExecution({
    name: pipelineName,
  }).promise();
  return response;
}

module.exports = {
  startPipelineExecution,
};
