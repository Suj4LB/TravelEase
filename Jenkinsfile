pipeline {
    agent {
        label 'dev-deploy'
    }
    tools {
        nodejs 'nodejs23'
    }
    environment {
        SCANNER_HOME = tool 'sonar-scanner'
        ECR_REPO = 'travelease'
        AWS_CREDENTIALS_ID = 'aws-cred'
        AWS_REGION = 'ap-south-1'
    }

    stages {
        stage('Removing old Containers') {
            steps {
                dir('TravelEase') {
                    sh "docker compose down"
                }
            }
        }

        stage('Removing old Images') {
            steps {
                sh '''
                    echo "Stopping and removing all containers..."
                    docker ps -aq | xargs -r docker stop
                    docker ps -aq | xargs -r docker rm

                    echo "Removing all Docker images..."
                    docker images -aq | xargs -r docker rmi -f
                '''
            }
        }

        stage('Git Checkout') {
            steps {
                dir('TravelEase') {
                    git branch: 'frontend', credentialsId: 'travel', url: 'https://github.com/TravelEase-Xebia/TravelEase.git'
                }
            }
        }

        stage('Trivy FS Scan') {
            steps {
                dir('TravelEase') {
                    sh 'trivy fs --format table -o fs-dev-prod.html .'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    dir('TravelEase') {
                        sh '''$SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=TravelEase-dev-prod -Dsonar.projectKey=TravelEase-dev-prod \
                              -Dsonar.sources=.
                           '''
                    }
                }
            }
        }

        stage('Starting Services') {
            steps {
                dir('TravelEase') {
                    sh "docker compose up --build"
                }
            }
        }

        stage('Trivy Image Scan') {
            steps {
                sh "trivy image --format table -o dev-image-frontend.html ${ECR_REPO}-frontend:latest"
                sh "trivy image --format table -o dev-image-payment.html ${ECR_REPO}-payment:latest"
                sh "trivy image --format table -o dev-image-booking.html ${ECR_REPO}-booking:latest"
                sh "trivy image --format table -o dev-image-nginx-proxy.html ${ECR_REPO}-nginx-proxy:latest"
                sh "trivy image --format table -o dev-image-login.html ${ECR_REPO}-login:latest"
            }
        }

        stage('Upload Trivy scan reports to S3') {
            steps {
                withCredentials([[ 
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-cred'
                ]]) {
                    sh 'aws s3 cp dev-image-frontend.html s3://dev-travel-ease-trivy-report/'
                    sh 'aws s3 cp dev-image-booking.html s3://dev-travel-ease-trivy-report/'
                    sh 'aws s3 cp dev-image-payment.html s3://dev-travel-ease-trivy-report/'
                    sh 'aws s3 cp dev-image-nginx-proxy.html s3://dev-travel-ease-trivy-report/'
                    sh 'aws s3 cp dev-image-login.html s3://dev-travel-ease-trivy-report/'
                    sh 'aws s3 cp fs-dev-prod.html s3://dev-travel-ease-trivy-report/'
                }
            }
        }

        stage('Branch update') {
            steps {
                echo 'Hello World'
            }
        }
    }
}
