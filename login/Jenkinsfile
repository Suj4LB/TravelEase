pipeline {
    agent any
    tools{
        nodejs 'nodejs23'
    }
    environment{
        SCANNER_HOME=tool 'sonar-scanner'
        ECR_REGISTERY='831926586767.dkr.ecr.us-east-1.amazonaws.com'
        ECR_REPO = 'travelease/login'
        AWS_CREDENTIALS_ID = 'aws-cred'
        AWS_CREDENTIALS_ID2 = 'bhavesh-aws'
        AWS_REGION = 'ap-south-1'
        SNYK_TOKEN = 'snyk-token'
        IMAGE_TAG = 16073159175
    }

    stages {
        stage('Clean Workspace'){
            steps{
                cleanWs()
            }
        }
        stage('Git Checkout') {
            steps {
                dir('login') {
                    git branch: 'login', credentialsId: 'akshat', url: 'https://github.com/TravelEase-Xebia/TravelEase.git'
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
                sh 'trivy fs --format table -o fs-login.html .'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    dir('login') {
                        sh '''$SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=TravelEase-login -Dsonar.projectKey=TravelEase-login \
                              -Dsonar.sources=.
                           '''
                    }
                }
            }
        }
            stage('Snyk Scan') {
            steps {
                dir('login') {
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
                string(credentialsId: 'snyk-token', variable: 'SNYK_TOKEN'),
                [$class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'bhavesh-aws']
            ]) {
                dir('login') {
                    sh '''
                        snyk auth $SNYK_TOKEN
                        # Run Snyk code test but don't stop the pipeline even if it fails
                        snyk code test > snyk-login.txt || true
                        aws s3 cp snyk-login.txt s3://travel-ease-snyk-login-report-b/
                    '''
                }
            }
        }
    }
}

        stage('Build Image') {
            steps {
                dir('login') {
                  sh "docker build -t ${ECR_REGISTERY}/${ECR_REPO}:${IMAGE_TAG} ."
                }
                
            }
        }
        stage('Trivy Image Scan') {
            steps {
                sh 'trivy image --format table -o image-login.html ${ECR_REGISTERY}/${ECR_REPO}:${IMAGE_TAG}'
            }
        }
        stage('Upload Trivy scan reports to S3') {
            steps {
              
                    withCredentials([[
                        $class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: 'bhavesh-aws'
                    ]]) {
                        sh 'aws s3 cp image-login.html s3://travel-ease-login-trivy-report-b/'
                        sh 'aws s3 cp fs-login.html s3://travel-ease-login-trivy-report-b/'
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
        stage('pulling main production branch') {
            steps {
                dir('TravelEase') {
                    git branch: 'dev-prod', credentialsId: 'akshat', url: 'https://github.com/TravelEase-Xebia/TravelEase.git'
                }
            }
        }
        stage('Updating dev-prod production branch') {
            steps {
                sh 'mkdir -p ./TravelEase/login'
                sh 'rsync -av --exclude=".git" ./login/ ./TravelEase/login/'
            }
        }
        stage('push code to dev-prod production branch') {
            steps {
                dir('TravelEase') {
            withCredentials([usernamePassword(credentialsId: 'akshat', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                sh '''
                    git config user.name "$GIT_USER"
                    git config user.email "$GIT_USER@users.noreply.github.com"
                    
                    git add .
                    git commit -m "CI: Updated login into main production branch" || echo "No changes to commit"
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
