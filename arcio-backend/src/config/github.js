const { Octokit } = require('@octokit/rest')
const logger = require('../utils/logger')

let octokitOptions = {
  userAgent: 'arcio-app v0.1'
}

if (process.env.GITHUB_TOKEN) {
  octokitOptions.auth = process.env.GITHUB_TOKEN;
}

let octokit = new Octokit(octokitOptions)

const testGitHub = async () => {
  try {
    if (octokitOptions.auth) {
      await octokit.rest.users.getAuthenticated()
      logger.info('GitHub API connected (Authenticated)')
    } else {
      logger.info('GitHub API connected (Unauthenticated - Limited rate)')
    }
  } catch (error) {
    logger.error(`GitHub API auth failed: ${error.message}. Falling back to unauthenticated mode.`)
    delete octokitOptions.auth;
    octokit = new Octokit(octokitOptions);
    module.exports.octokit = octokit;
  }
}

testGitHub()

module.exports = { 
  get octokit() { return octokit; }
}