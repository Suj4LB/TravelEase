pipeline {
    agent any
    environment{
        ECR_REGISTERY='794038217891.dkr.ecr.ap-south-1.amazonaws.com'
        ECR_REPO = 'travelease/nginx-proxy'
        AWS_CREDENTIALS_ID = 'aws-cred'
        AWS_REGION = 'ap-south-1'
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
        stage('Unit Test') {
            steps {
                echo 'Hello World'
            }
        }
        stage('Build Image') {
            steps {
                dir('nginx-proxy') {
                  sh "docker build -t ${ECR_REGISTERY}/${ECR_REPO}:latest ."
                }
                
            }
        }
        stage('Trivy Image Scan') {
            steps {
                sh 'trivy image --format table -o image-nginx-proxy.html ${ECR_REGISTERY}/${ECR_REPO}:latest'
            }
        }
        stage('Upload Trivy scan reports to S3') {
            steps {
              
                    withCredentials([[
                        $class: 'AmazonWebServicesCredentialsBinding',
                        credentialsId: 'aws-cred'
                    ]]) {
                        sh 'aws s3 cp image-nginx-proxy.html s3://travel-ease-nginx-proxy-trivy-report/'
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
                    aws ecr get-login-password --region $AWS_REGION | \
                    docker login --username AWS --password-stdin 794038217891.dkr.ecr.ap-south-1.amazonaws.com
                  '''
                }
            }
        }
        stage('Push to ECR') {
            steps {
                script{
                    sh "docker push ${ECR_REGISTERY}/${ECR_REPO}:latest"
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
