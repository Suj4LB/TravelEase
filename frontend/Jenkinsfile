pipeline {
    agent any
    tools{
        nodejs 'nodejs23'
    }
    environment{
        SCANNER_HOME=tool 'sonar-scanner'
        ECR_REGISTERY='831926586767.dkr.ecr.us-east-1.amazonaws.com'
        ECR_REPO = 'travelease/frontend'
        AWS_CREDENTIALS_ID = 'aws-cred'
        AWS_CREDENTIALS_ID2 = 'bhavesh-aws'
        AWS_REGION = 'ap-south-1'
        SNYK_TOKEN = 'snyk-token'
        IMAGE_TAG = 16074697737
    }

    stages {
        stage('Clean Workspace'){
            steps{
                cleanWs()
            }
        }
        stage('Git Checkout') {
            steps {
                dir('frontend') {
                    git branch: 'frontend', credentialsId: 'travel', url: 'https://github.com/TravelEase-Xebia/TravelEase.git'
                }
            }
        }
         stage('Installing Dependencies') {
            steps {
                dir('frontend') {
                    sh 'npm install'
                }
            }
        }
         stage('Build Code') {
            steps {
                dir('frontend') {
                    sh 'npm run build'
                }
            }
        }
        stage('Unit Test') {
            steps {
                echo 'Hello World'
            }
        }
        stage('Trivy FS Scan') {
            steps {
                sh 'trivy fs --format table -o fs-frontend.html .'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    dir('frontend') {
                        sh '''$SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=TravelEase-frontend -Dsonar.projectKey=TravelEase-frontend \
                              -Dsonar.sources=.
                           '''
                    }
                }
            }
        }
        stage('Snyk Scan') {
            steps {
                dir('frontend') {
                    snykSecurity(
                        snykInstallation: 'snyk@travelease',
                        snykTokenId: 'travelease_snyk',
                        failOnIssues: false
                    )
                }
            }
        }
        stage('Snyk Code Scan (AI)') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    withCredentials([
                        string(credentialsId: 'snyk-token', variable: 'SNYK_TOKEN')
                    ]) {
                        withCredentials([
                            [$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'bhavesh-aws']
                        ]) {
                            dir('frontend') {
                                sh """
                                    snyk auth $SNYK_TOKEN
                                    snyk code test > snyk-frontend.txt
                                    aws s3 cp snyk-frontend.txt s3://travel-ease-snyk-frontend-report-b/
                                """
                            }
                        }
                    }
                }
            }
        }
        stage('Build Image') {
            steps {
                dir('frontend') {
                  sh "docker build -t ${ECR_REGISTERY}/${ECR_REPO}:${IMAGE_TAG} ."
                }
                
            }
        }
        stage('Trivy Image Scan') {
            steps {
                sh 'trivy image --format table -o image-frontend.html ${ECR_REGISTERY}/${ECR_REPO}:${IMAGE_TAG}'
            }
        }
        stage('Upload Trivy scan reports to S3') {
            steps {
              
                    withCredentials([[
                        $class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: 'bhavesh-aws'
                    ]]) {
                        sh 'aws s3 cp image-frontend.html s3://travel-ease-frontend-trivy-report-b/'
                        sh 'aws s3 cp fs-frontend.html s3://travel-ease-frontend-trivy-report-b/'
                    }
            
            }
        }
        stage('Login ECR') {
            steps {
                withCredentials([[
                  $class: 'AmazonWebServicesCredentialsBinding',
                  credentialsId: 'aws-cred'
                    ]]) {
                  sh '''
                    aws ecr get-login-password --region us-east-1 | \
                    docker login --username AWS --password-stdin 831926586767.dkr.ecr.us-east-1.amazonaws.com
                  '''
                }
            }
        }
        stage('Push to ECR') {
            steps {
                script{
                    sh "docker push ${ECR_REGISTERY}/${ECR_REPO}:${IMAGE_TAG}"
                }
            }
        }
        stage('pulling dev production branch') {
            steps {
                dir('TravelEase') {
                    git branch: 'dev-prod', credentialsId: 'travel', url: 'https://github.com/TravelEase-Xebia/TravelEase.git'
                }
            }
        }
        stage('Updating dev production branch') {
            steps {
                sh 'mkdir -p ./TravelEase/frontend'
                sh 'rsync -av --exclude=".git" --exclude="dist" ./frontend/ ./TravelEase/frontend/'
            }
        }
        stage('push code to dev-prod production branch') {
            steps {
                dir('TravelEase') {
            withCredentials([usernamePassword(credentialsId: 'travel', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                sh '''
                    git config user.name "$GIT_USER"
                    git config user.email "$GIT_USER@users.noreply.github.com"
                    
                    git add .
                    git commit -m "CI: Updated frontend into dev-prod production branch" || echo "No changes to commit"
                    git push https://$GIT_USER:$GIT_TOKEN@github.com/TravelEase-Xebia/TravelEase.git HEAD:dev-prod
                '''
            }
        }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
