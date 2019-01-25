final String STATUS_PENDING = 'PENDING'
final String STATUS_SUCCESS = 'SUCCESS'
final String STATUS_FAILURE = 'FAILURE'
final String CONTEXT_HEALTH = 'health'

pipeline {
    agent any
    stages {
        stage('Health') {
            agent {
                label 'master'
            }
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: env.ghprbActualCommit]],
                    userRemoteConfigs: [[
                        url: 'git@github.com:HaikuTeam/diez.git'
                    ]],
                    credentialsId: '3ff59e15-b2b1-45fd-b570-8f362dc7b7fc',
                    refspec: '+refs/pull/*:refs/remotes/origin/pr/*',
                    extensions: [[$class: 'CleanBeforeCheckout']]
                ])
                setBuildStatus(CONTEXT_HEALTH, 'health checks started', STATUS_PENDING)
                sh '''#!/bin/bash -x
                    . $HOME/.bash_profile
                    yarn
                    yarn compile
                    yarn health  --stream --concurrency 1'''
            }
            post {
                always {
                    archiveArtifacts allowEmptyArchive: true, artifacts: 'packages/**/test-result.tap', fingerprint: true
                    step([
                        $class: 'TapPublisher',
                        testResults: 'packages/**/test-result.tap',
                        verbose: true,
                        planRequired: true
                    ])
                    cobertura autoUpdateHealth: false, autoUpdateStability: false, coberturaReportFile: 'packages/**/cobertura-coverage.xml', failNoReports: false, failUnhealthy: false, failUnstable: false, maxNumberOfBuilds: 0, onlyStable: false, sourceEncoding: 'ASCII', zoomCoverageChart: false
                    checkstyle canRunOnFailed: false, defaultEncoding: '', healthy: '', pattern: '**/checkstyle-result.xml', unHealthy: ''
                }
                success {
                    setBuildStatus(CONTEXT_HEALTH, 'health checks passed', STATUS_SUCCESS)
                    slackSend([
                        channel: 'engineering-feed',
                        color: 'good',
                        message: ":jenkins-angel: PR #${env.ghprbPullId} (https://github.com/HaikuTeam/diez/pull/${env.ghprbPullId}) is healthy!"
                    ])
                }
                failure {
                    setBuildStatus(CONTEXT_HEALTH, 'health checks failed', STATUS_FAILURE)
                    slackSend([
                        channel: 'engineering-feed',
                        color: 'danger',
                        message: ":jenkins-rage: PR #${env.ghprbPullId} (https://github.com/HaikuTeam/diez/pull/${env.ghprbPullId}) failed health checks!"
                    ])
                }
            }
        }
    }
}

void setBuildStatus(String context, String message, String state) {
    step([
        $class: 'GitHubCommitStatusSetter',
        commitShaSource: [$class: "ManuallyEnteredShaSource", sha: env.ghprbActualCommit],
        contextSource: [$class: 'ManuallyEnteredCommitContextSource', context: context],
        reposSource: [$class: 'ManuallyEnteredRepositorySource', url: 'https://github.com/HaikuTeam/diez'],
        errorHandlers: [[$class: 'ChangingBuildStatusErrorHandler', result: 'UNSTABLE']],
        statusResultSource: [
            $class: 'ConditionalStatusResultSource',
            results: [[$class: 'AnyBuildResult', message: message, state: state]]
        ]
    ])
}
