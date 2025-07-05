pipeline {
    agent any
    environment{
        ECR_REGISTERY='831926586767.dkr.ecr.us-east-1.amazonaws.com'
        ECR_REPO = 'travelease/nginx-proxy'
        AWS_CREDENTIALS_ID = 'aws-cred'
        AWS_CREDENTIALS_ID2 = 'bhavesh-cred'
        AWS_REGION = 'ap-south-1'
        IMAGE_TAG = 16073233821
    }

    stages {
        stage('Clean Workspace'){
            steps{
                cleanWs()
            }
        }
        stage('Git Checkout') {
            steps {
                dir('nginx-proxy') {
                    git branch: 'nginx-proxy', credentialsId: 'bhavesh', url: 'https://github.com/TravelEase-Xebia/TravelEase.git'
                }
            }
        }
        stage('Build Image') {
            steps {
                dir('nginx-proxy') {
                  sh "docker build -t ${ECR_REGISTERY}/${ECR_REPO}:${IMAGE_TAG} ."
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
        stage('pulling dev-prod production branch') {
            steps {
                dir('TravelEase') {
                    git branch: 'dev-prod', credentialsId: 'bhavesh', url: 'https://github.com/TravelEase-Xebia/TravelEase.git'
                }
            }
        }
        stage('Updating dev-prod production branch') {
            steps {
                sh 'mkdir -p ./TravelEase/nginx-proxy'
                sh 'rsync -av --exclude=".git" ./nginx-proxy/ ./TravelEase/nginx-proxy/'
            }
        }
        stage('push code to prod production branch') {
            steps {
                dir('TravelEase') {
            withCredentials([usernamePassword(credentialsId: 'bhavesh', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
                sh '''
                    git config user.name "$GIT_USER"
                    git config user.email "$GIT_USER@users.noreply.github.com"

                    git add .
                    git commit -m "CI: Updated payment into dev-prod production branch" || echo "No changes to commit"
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
