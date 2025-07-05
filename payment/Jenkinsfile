pipeline {
    agent any
    tools{
        nodejs 'nodejs23'
    }
    environment{
        SCANNER_HOME=tool 'sonar-scanner'
        ECR_REGISTERY='831926586767.dkr.ecr.us-east-1.amazonaws.com'
        ECR_REPO = 'travelease/payment'
        AWS_CREDENTIALS_ID = 'aws-cred'
        AWS_CREDENTIALS_ID2= 'bhavesh-aws'
        AWS_REGION = 'ap-south-1'
        SNYK_TOKEN = 'snyk-token'
        IMAGE_TAG = 16073090503
    }

    stages {
        stage('Git Checkout') {
            steps {
                dir('payment') {
                    git branch: 'payment', credentialsId: 'bhavesh', url: 'https://github.com/TravelEase-Xebia/TravelEase.git'
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
                sh 'trivy fs --format table -o fs-payment.html .'
            }
        }
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-server') {
                    dir('payment') {
                        sh '''$SCANNER_HOME/bin/sonar-scanner -Dsonar.projectName=TravelEase-payment -Dsonar.projectKey=TravelEase-payment \
                              -Dsonar.sources=.
                           '''
                    }
                }
            }
        }

        stage('Snyk Scan') {
            steps {
                dir('payment') {
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
                    dir('payment') {
                        sh """
                            snyk auth $SNYK_TOKEN
                            snyk code test > snyk-payment.txt
                            aws s3 cp snyk-payment.txt s3://travel-ease-snyk-report-b/
                        """
                    }
                }
            }
        }
    }
}



        stage('Build Image') {
            steps {
                dir('payment') {
                 sh "docker build -t ${ECR_REGISTERY}/${ECR_REPO}:${IMAGE_TAG} ."
                }
                
            }
        }
        stage('Trivy Image Scan') {
            steps {
                sh 'trivy image --format table -o image-payment.html ${ECR_REGISTERY}/${ECR_REPO}:${IMAGE_TAG}'
            }
        }
stage('Upload Trivy and Snyk reports to S3') {
    steps {
        withCredentials([[
            $class: 'AmazonWebServicesCredentialsBinding',
            credentialsId: 'bhavesh-aws'
        ]]) {
            sh 'aws s3 cp image-payment.html s3://travel-ease-payment-trivy-report-b/'
            sh 'aws s3 cp fs-payment.html s3://travel-ease-payment-trivy-report-b/'
            dir('payment') {
                sh '''
                    if [ -f snyk-payment.txt ]; then
                        aws s3 cp snyk-payment.txt s3://travel-ease-snyk-report-b/
                        rm snyk-payment.txt
                    else
                        echo "No Snyk Code report found to upload."
                    fi
                '''
            }
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
        stage('pulling prod production branch') {
            steps {
                dir('TravelEase') {
                    git branch: 'dev-prod', credentialsId: 'bhavesh', url: 'https://github.com/TravelEase-Xebia/TravelEase.git'
                }
            }
        }
        stage('Updating dev-prod production branch') {
            steps {
                sh 'mkdir -p ./TravelEase/payment'
                sh 'rsync -av --exclude=".git" ./payment/ ./TravelEase/payment/'
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
}
